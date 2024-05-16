const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const Candidate = require('../models/candidate');
const { jwtAuthMiddleware } = require('./../utils/jwt');

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user.role === "admin";
    } catch (err) {
        return false;
    }
};

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
            return res.status(403).send({ message: "You are not authorized to perform this action" });
        }

        const newCandidate = new Candidate(req.body);
        const response = await newCandidate.save();
        res.status(200).json({ response });
    } catch (err) {
        console.error('error', err);
        res.status(500).json({ error: "server error" });
    }
});

router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
            return res.status(403).send({ message: "You are not authorized to perform this action" });
        }

        const { candidateID } = req.params;
        const updatedCandidateData = req.body;
        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: "candidate not found" });
        }

        res.status(200).json({ response });
    } catch (err) {
        console.error('error', err);
        res.status(500).json({ error: "server error" });
    }
});

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
            return res.status(403).send({ message: "You are not authorized to perform this action" });
        }

        const { candidateID } = req.params;
        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: "candidate not found" });
        }

        console.log('successfully deleted candidate ...');
        res.sendStatus(204);
    } catch (err) {
        console.error('error', err);
        res.status(500).json({ error: "server error" });
    }
});

router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        const { candidateID } = req.params;
        const userID = req.user.id;

        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: "candidate not found" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        if (user.isVoted) {
            return res.status(403).json({ message: "you have already voted" });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "admin is not allowed" });
        }

        candidate.votes.push({ user: userID });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: "vote recorded successfully" });
    } catch (err) {
        console.error('error', err);
        res.status(500).json({ error: "server error" });
    }
});

router.get('/vote/count', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });
        const voteRecord = candidates.map((data) => ({
            party: data.party,
            count: data.voteCount,
        }));
        res.status(200).json(voteRecord);
    } catch (err) {
        console.error('error', err);
        res.status(500).json({ error: "server error" });
    }
});

module.exports = router;
