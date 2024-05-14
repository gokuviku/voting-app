const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const { generateToken } = require('./../utils/jwt')

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
        const {aadharCardNumber , password} = req.body;
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});


        const paylod = {
            id: response._id,
            username:user.name
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