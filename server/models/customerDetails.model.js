import mongoose, { Schema } from 'mongoose';
import { PersonalDetails } from './personalDetails.model.js';
import { AccountDetails } from './accountDetails.model.js';
import { EmploymentDetails } from './employmentDetails.model.js';
import { LoginDetails } from './loginDetails.model.js';

// Customer schema definition
const customerSchema = new Schema({
    personalDetails: {
        type: Schema.Types.ObjectId,
        ref: 'PersonalDetails',
    },
    accountDetails: {
        type: Schema.Types.ObjectId,
        ref: 'AccountDetails',
    },
    employmentDetails: {
        type: Schema.Types.ObjectId,
        ref: 'EmploymentDetails'
    },
    loginDetails: {
        type: Schema.Types.ObjectId,
        ref: 'LoginDetails',
    }
}, {
    timestamps: true
});

export const Customer = mongoose.model('Customer', customerSchema);
