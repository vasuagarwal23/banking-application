import mongoose, { Schema } from 'mongoose';
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
