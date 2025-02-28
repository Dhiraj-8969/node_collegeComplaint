const express=require('express');
const router = express.Router();
const User = require('./../models/userSchema');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
router.post('/signup', async(req, res) => {
  try {
      const data = req.body;
      const newPerson = new User(data);
      const response = await newPerson.save();
      console.log('data saved');
      const payload = {
          id: response.id,
          CLG_RollNo: response.CLG_RollNo
      }
      console.log(JSON.stringify(payload));
      const token = generateToken(payload);
      console.log("token is: ", token);
      res.status(200).json({ response: response, token: token });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/login', async(req, res) => {
  try {
      const { ROLLNO, password } = req.body;
      const user = await User.findOne({ CLG_RollNo: ROLLNO });
      if (!user || !(await user.comparePassword(password))) {
          return res.status(401).json({ error: 'Invalid username or password' });
      }
      const payload = {
        id: user.id,
        CLG_RollNo: user.CLG_RollNo
      }
      const token = generateToken(payload);
      console.log(token);
      res.status(200).json({ msg: 'login seccefully', token: token });
  } catch (err) {
      console.error(err);
      res.status(500).json({ erorr: 'Internal server Error' });
  }
})
router.get('/profile', jwtAuthMiddleware, async(req, res) => {
  try {
      const userData = req.user;
      const userId = userData.id;
      const user = await User.findById(userId);
      res.status(200).json({ user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ erorr: 'Internal server Error' });
  }
})

router.put('/profile/password', jwtAuthMiddleware, async(req, res) => {
  try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(userId);

      if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      user.password = newPassword;
      await user.save();
      console.log('password updated');
      res.status(200).json({ massage: 'Password updated' });

  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Erorr' });
  }
});

module.exports=router;