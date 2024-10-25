const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');

const router = express.Router();

// Admin Sign-Up
router.post('/admin_signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newAdmin = new Admin({ username, email, password });
        await newAdmin.save();
        res.redirect('/admin_signin.html');
    } catch (error) {
        console.error('Sign-Up Error:', error);
        res.status(500).send('Error signing up');
    }
});

// Admin Sign-In
router.post('/admin_signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin && await bcrypt.compare(password, admin.password)) {
            res.redirect('/admin_dashboard.html');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Sign-In Error:', error);
        res.status(500).send('Error signing in');
    }
});

module.exports = router;
