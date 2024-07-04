import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const accountDetailsSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/\S+@\S+\.\S+/, 'Email is invalid']
        },
        mobileNumber: {
            type: String,
            required: [true, 'Mobile number is required'],
        },
        otp: {
            type: String
        },
        otpExpires: {
            type: Date
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        isMobileVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const AccountDetails = mongoose.model('AccountDetails', accountDetailsSchema);
