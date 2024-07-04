import mongoose, { Schema } from 'mongoose';

// Validator function to check age
function validateAge(value) {
    if (!(value instanceof Date)) {
        return false;
    }
    const dob = value;
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 18;
}

// Personal details schema definition
const personalDetailsSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        match: [/^[a-zA-Z]+$/, 'First name can only contain letters']
    },
    middleName: {
        type: String,
        match: [/^[a-zA-Z]*$/, 'Middle name can only contain letters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        match: [/^[a-zA-Z]+$/, 'Last name can only contain letters']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: validateAge,
            message: 'Age must be 18 years or older'
        }
    },
    buildingName: {
        type: String
    },
    flatOrBuildingNumber: {
        type: String,
        required: [true, 'Flat or building number is required']
    },
    streetName: {
        type: String,
        required: [true, 'Street name is required']
    },
    townOrCity: {
        type: String,
        required: [true, 'Town or city is required']
    },
    stateOrRegion: {
        type: String,
        required: [true, 'State or region is required']
    },
    postcode: {
        type: String,
        required: [true, 'Postcode is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    currentAddressDuration: {
        type: String,
        enum: ['6 months or more', 'Less than 6 months'],
        required: [true, 'Duration at current address is required']
    }
}, {
    timestamps: true
});

export const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);
