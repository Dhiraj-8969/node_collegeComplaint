const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  CLG_RollNo: {
    type: String,
    required: true,
    unique: true
  },
  UNI_RollNo: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    enum: ['Student', 'Admin'],
    default:'Student'
  }
});

UserSchema.pre("save", async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
  } catch (err) {
      return next(err);
  }
})

UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
  } catch (err) {
      throw err;
  }
}
const User=mongoose.model('User', UserSchema);
module.exports= User;