import mongoose, { Schema } from 'mongoose';

// Employment details schema definition
const employmentDetailsSchema = new Schema({
    employmentStatus: {
        type: String,
        enum: ['Full-time employed', 'Part-time employed', 'Self-employed', 'Retired', 'Student', 'Not in employment'],
    },
    typeOfIndustry: {
        type: String,
    },
    occupation: {
        type: String,
    },
    income: {
        type: String,
    },
    nationality: {
        type: String,
    },
    taxResident: {
        type: String,
    }
}, {
    timestamps: true
});

export const EmploymentDetails = mongoose.model('EmploymentDetails', employmentDetailsSchema);
