const express=require('express');
const router = express.Router();
const User = require('./../models/userSchema');
const complan = require('./../models/complaintsSchema');

router.post('/', async(req, res) => {
  try {
      const userData = req.user;
      const userId = userData.id;
      const data = req.body;
      const newcomplan = new complan(data);
      newcomplan.student_id = userId;
      const response = await newcomplan.save();
      console.log('complaint  successfully..');
      res.status(200).json({response});
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async(req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const response = await complan.find({ student_id: userId });
    console.log('response fetched');
    res.status(200).json(response);
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/status/:complanId', async(req, res) => {
  try {
    const complanId = req.params.complanId;
    const response = await complan.findById(complanId);
    console.log('response fetched');
    res.status(200).json({ status : response.status});
  } catch (err) {
      console.error(err);
      res.status(500).json({ erorr: 'Internal server Error' });
  }
})
router.delete('/status/:complanId', async(req, res) => {
  try {
      const complanId = req.params.complanId;
      const response = await complan.findByIdAndDelete(complanId);

      if (!response) {
          return res.status(404).json({ erorr: 'complaint not found' })
      }
      console.log('complaint delete');
      res.status(200).json({ message: 'complaint Deleted successfully' });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Erorr' });
  }
})

module.exports=router;