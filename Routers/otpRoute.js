const express = require('express');
const route = express.Router();

const { generateOTP, sendOTP } = require('../middleware/fun')

const otps = new Map();

//==============================================SEND OTP==============================================
route.post('/otp', async (req, res) => {
    try {
        const { MobileNumber } = req.body;

        if (!MobileNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        const otp = generateOTP();
        const expirationTime = Date.now() + 5 * 60 * 1000;

        otps.set(MobileNumber, { otp, expirationTime });
        sendOTP(MobileNumber, otp);

        return res.status(200).json({ message: 'OTP sent successfully', });
    } catch (error) {
        return res.status(400).json({ message: 'OTP cannot sent', });
    }
});

//==============================================RESEND OTP==============================================
route.post('/otp/resend', (req, res) => {
    const { MobileNumber } = req.body;

    if (!MobileNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    if (!otps.has(MobileNumber)) {
        return res.status(404).json({ error: 'No OTP found for the phone number' });
    }

    const { otp, expirationTime } = otps.get(MobileNumber);

    if (Date.now() < expirationTime) {
        sendOTP(MobileNumber, otp);
        return res.json({ message: 'OTP resent successfully' });
    }

    return res.status(400).json({ error: 'OTP has expired' });
});

//==============================================VERIFY OTP==============================================
route.post('/otp/verify', (req, res) => {
    const { MobileNumber, otp } = req.body;

    if (!MobileNumber || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    if (!otps.has(MobileNumber)) {
        return res.status(404).json({ error: 'No OTP found for the phone number' });
    }

    const { expirationTime } = otps.get(MobileNumber);

    if (Date.now() < expirationTime) {
        if (otps.get(MobileNumber).otp === otp) {
            otps.delete(MobileNumber);
            return res.json({ message: 'OTP is valid' });
        } else {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
    } else {
        return res.status(400).json({ error: 'OTP has expired' });
    }
});

module.exports = route