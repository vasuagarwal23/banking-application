import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { LoginDetails } from "../models/loginDetails.model.js";
import { Customer } from "../models/customerDetails.model.js";
import dotenv from 'dotenv';

dotenv.config();
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        // Find user by ID
        const user = await LoginDetails.findById(userId);

        if (!user) {
            throw new Error("User not found"); // Adjust error message as needed
        }

        // Generate new tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Update user's refreshToken field in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in generateAccessAndRefereshTokens:", error);
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { username, password, customerId, confirmPassword } = req.body;

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if (!customer) {
        throw new ApiError(400, 'Customer not found');
    }

    if (
        [username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await LoginDetails.findOne({ username })

    if (existedUser) {
        throw new ApiError(409, "Customer with username already exists")
    }
    if (password !== confirmPassword) {
        throw new ApiError(400, "password and confirmPassword doesn't match");
    }
    const user = await LoginDetails.create({
        username: username.toLowerCase(),
        password

    })

    const createdUser = await LoginDetails.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the Customer")
    }

    customer.loginDetails = createdUser._id;
    await customer.save();
    return res.status(201).json(
        new ApiResponse(200, createdUser, "Customer registered Successfully")
    )

})



const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { username, password } = req.body

    if (!username) {
        throw new ApiError(400, "username is required")
    }


    const user = await LoginDetails.findOne({ username });

    if (!user) {
        throw new ApiError(404, "Customer does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Customer credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await LoginDetails.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "Customer logged In Successfully"
            )
        )

})


const logoutUser = asyncHandler(async (req, res) => {
    await LoginDetails.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Customer logged Out"))
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await LoginDetails.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken };
