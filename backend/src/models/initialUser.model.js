import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const InitialUserSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    OTP : {
        type : String ,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 600 
    }
});

export  const InitialUser = mongoose.model("InitialUser",InitialUserSchema)