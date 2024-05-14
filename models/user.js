const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },

    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
  
    mobile: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,

    },
    work: {
        type: String,
        enum: ['cheif', 'waitor', 'manager'],
        required: true,
    },
    aadharCard: {
        type: Number,
        required:true,
        unique:true,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default:'voter',
    },
    isVoted: {
        type: Boolean,
        default:false,
    },
    // votingHistory: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Vote'
    // }],
});

// Define User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
