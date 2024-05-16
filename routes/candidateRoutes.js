const express = require('express')
const app = express()
const router = express.Router()
const User = require('./../models/user')
const { jwtAuthMiddleware, generateToken } = require('./../utils/jwt')

const Candidate = require('../models/candidate');


const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID)

        return user.role === "admin"
    } catch (err) {
        return false;
    }
}

router.post('/', async (req, res) => {
    try {
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).send({ message: "You are not authorized to perform this action" })
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save()
        res.status(200).json({ response: response })



    } catch (err) {
        console.log('error', err);
        res.status.json({ error: "server error" })

    }
})



router.put('/:candidateID', async (req, res) => {
    if (!checkAdminRole(req.user.id)) {
        return res.status(403).send({ message: "You are not authorized to perform this action" })
    }
    try {
        const personId = req.params.candidateID;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        user.password = newPassword;
        await user.save();

        console.log('password updated successfully');
        res.status(200).json({ message: "password updated" });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ error: "server error" });
    }
});
