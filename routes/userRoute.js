const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const { jwtAuthMiddleware, generateToken } = require('./../utils/jwt')

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);

        const response = await newUser.save();
        console.log('saved!');

        const paylod = {
            id: response._id
        }

        console.log(JSON.stringify(paylod));
        const token = generateToken(payload);
        console.log('token is :', token);

        res.status(200).json({ response: response, token: token })

    } catch (err) {
        console.log('error', err);

        res.status(500).json({ error: "server error" });

    }
})

router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

        if (!user || (await user.copmarePassword(password))) {
            return res.status(401).json({ error: "invalid credentials" });
        }

        const paylod = {
            id: response._id,
            username: user.name
        }

        console.log(JSON.stringify(paylod));
        const token = generateToken(payload);
        console.log('token is :', token);

        res.status(200).json({ response: response, token: token })

    } catch (err) {
        console.log('error', err);

        res.status(500).json({ error: "server error" });

    }
})


router.get('/profile', async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId)

        res.status(200).json({ user: user })

    } catch (err) {
        console.log('error', err);
        res.status.json({error:"server error"})

    }
})



router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
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
