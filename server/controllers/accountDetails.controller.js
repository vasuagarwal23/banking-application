import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AccountDetails } from "../models/accountDetails.model.js";
import { Customer } from "../models/customerDetails.model.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'hans.volkman@ethereal.email',
        pass: 'Ht1Uz5qCpddbxh37dj'
    }
});

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: '<vagarwal_be21@thapar.edu>',
        to: email,
        subject: 'Your OTP for Email Verification',
        text: `Your OTP is ${otp}`
    };
    await transporter.sendMail(mailOptions);
};
console.log('TWILIO_SID:', process.env.TWILIO_SID);
console.log('TWILIO_TOKEN:', process.env.TWILIO_TOKEN);

// Function to send OTP via SMS
const sendOtpSms = async (mobileNumber, otp) => {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const client = twilio(accountSid, authToken);
    let msgOptions = {
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobileNumber,
        body: `Your OTP is ${otp}`
    };
    try {
        const message = await client.messages.create(msgOptions);
        console.log(`OTP sent to ${mobileNumber}:`, message.status);
    } catch (error) {
        console.error('Error sending OTP via SMS:', error.message);
        throw new ApiError(500, `Error sending OTP via SMS: ${error.message}`);
    }
};

const createAccountDetails = asyncHandler(async (req, res) => {
    const { customerId, email, mobileNumber } = req.body;

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new ApiError(400, 'Customer not found');
    }

    // Check if email or mobile number already exists
    const existingAccount = await AccountDetails.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingAccount) {
        throw new ApiError(400, 'Email or mobile number already exists');
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex'); // Generate a 6-character OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Save OTP and details in the database
    const account = new AccountDetails({
        email,
        mobileNumber,
        otp,
        otpExpires
    });
    await account.save();

    // Associate account details with customer
    customer.accountDetails = account._id;
    await customer.save();

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(200).json(new ApiResponse('OTP sent to email', { accountId: account._id }));
});

const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { accountId, otp } = req.body;

    const account = await AccountDetails.findById(accountId);
    if (!account) {
        throw new ApiError(400, 'Invalid account ID');
    }

    if (account.otp !== otp || account.otpExpires < Date.now()) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    account.isEmailVerified = true;
    account.otp = undefined;
    account.otpExpires = undefined;
    await account.save();

    // Generate new OTP for mobile verification
    const newOtp = crypto.randomBytes(3).toString('hex');
    const newOtpExpires = Date.now() + 10 * 60 * 1000;

    account.otp = newOtp;
    account.otpExpires = newOtpExpires;
    await account.save();

    // Send OTP via SMS
    await sendOtpSms(account.mobileNumber, newOtp);

    res.status(200).json(new ApiResponse('Email verified successfully. OTP sent to mobile number.', { accountId: account._id }));
});

const verifyMobileOtp = asyncHandler(async (req, res) => {
    const { accountId, otp } = req.body;

    const account = await AccountDetails.findById(accountId);
    if (!account) {
        throw new ApiError(400, 'Invalid account ID');
    }

    if (account.otp !== otp || account.otpExpires < Date.now()) {
        throw new ApiError(400, 'Invalid or expired OTP');
    }

    account.isMobileVerified = true;
    account.otp = undefined;
    account.otpExpires = undefined;
    await account.save();

    res.status(201).json(new ApiResponse(200,"",'Mobile number verified successfully'));
});

export { createAccountDetails, verifyEmailOtp, verifyMobileOtp };
