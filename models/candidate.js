const mongoose = require('mongoose');

// Define User Schema
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        unique: true,
        required: true,
    },

    party: {
        type: String,
        unique: true

    },

    votes: {
        type: Number,
        default: 0
    }


});

// Define User Model
const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
