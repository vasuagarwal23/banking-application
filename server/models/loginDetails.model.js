import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Custom validator for username
const usernameValidator = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{8,20}$/;
    return usernameRegex.test(username);
};

// Custom validator for password
const passwordValidator = (password) => {
    const lengthRegex = /.{8,}/;
    const numberRegex = /[0-9]/;
    const uppercaseRegex = /[A-Z]/;
    const sequenceRegex = /(.)\1{2,}|1234|abcd|5678|(?:.)\2{2,}/;

    return lengthRegex.test(password) &&
        numberRegex.test(password) &&
        uppercaseRegex.test(password) &&
        !sequenceRegex.test(password);
};

// Login details schema definition
const loginDetailsSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        validate: [usernameValidator, 'Username must be 8-20 characters long and contain no special characters or spaces.']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: [passwordValidator, 'Password must be at least 8 characters long, contain at least 1 number, 1 uppercase letter, and not contain sequences or repeated characters.']
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true
});

loginDetailsSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

loginDetailsSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

loginDetailsSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
loginDetailsSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const LoginDetails = mongoose.model('LoginDetails', loginDetailsSchema);
