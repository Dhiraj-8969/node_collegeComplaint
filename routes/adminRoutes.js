const express=require('express');
const router = express.Router();
const User = require('./../models/userSchema');
const complan = require('./../models/complaintsSchema');

const checkAdminRole = async(userId) => {
  try {
      const user = await User.findById(userId);
      if (user.role === "Admin")
          return true;
  } catch (err) {
      return false;
  }
}

router.get('/', async(req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ massage: "user does not have admin role" });
        }
        const response = await complan.find();
        if(!response.length){
            return res.status(401).json({ massage: "Not any Complaints" });
        }
        console.log('Complaints fetched successfully');
        res.status(200).json(response);
  
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Erorr' });
    }
  });

router.put('/password', async(req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ massage: "user does not have admin role" });
        }
        const { rollNo , newPassword } = req.body;
        const user = await User.findOne({CLG_RollNo : rollNo});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
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

  router.put('/:complanId', async(req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return res.status(403).json({ massage: "user does not have admin role" });
        }
        const complanId = req.params.complanId;
        const updataStatus = req.body;
        const response = await complan.findByIdAndUpdate(complanId, updataStatus, {
            new: true,
            runValidators: true,
        });
  
        if (!response) {
            return res.status(404).json({ erorr: 'complaint not found' })
        }
        console.log('complaint data updated');
        res.status(200).json(response);
  
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Erorr' });
    }
  });
module.exports=router;