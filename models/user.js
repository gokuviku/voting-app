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
    aadharCardNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
    isVoted: {
        type: Boolean,
        default: false,
    },
    // votingHistory: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Vote'
    // }],
});

userSchema.pre('save', async function (next) {
    const person = this;

    if (!person.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(person.password, salt)

        person.password = hashedPassword
        next();

    } catch (error) {
        return next(error)
    }

})
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch;
    } catch (error) {
        throw error;
    }
}


// Define User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
