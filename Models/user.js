const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserRoles = require ('../enums/role');
const UserStatus = require('../enums/status');

// folder to define the schema of User Collection
const userSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : true 
    },
    email:{
        type : String,
        required : true ,
        unique : true 
    },
    password:{
        type : String,
        required: true
    },
    role:{
        type :String,
        enum: Object.values(UserRoles),
        required:true
    },
    status: {
        type : String,
        enum : Object.values(UserStatus)
    }
});

//hash password before save it to db 
userSchema.pre('save', async (next)=> {
    const user = this;
    user.password = await bcrypt.hash(user.password, 10);
    next();
  });

const User = mongoose.model('User',userSchema);
module.exports = User;