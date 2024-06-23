import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { customer } from "../models/customer.model.js";
import { Address } from "../models/customerAdress.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerCustomer = asyncHandler(async (req, res) => {
    const { FirstName, MiddleName, LastName, Email, DateOfBirth, currentAddressDuration, AddressDetails } = req.body;

    if ([FirstName, LastName, DateOfBirth, currentAddressDuration].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await customer.findOne({
        $or: [{ FirstName }, { Email }]
    });

    if (existedUser) {
        throw new ApiError(409, "Customer with email or username already exists");
    }

    const newCustomer = await customer.create({
        FirstName,
        MiddleName,
        LastName,
        Email,
        DateOfBirth,
        currentAddressDuration
    });

    if (!newCustomer) {
        throw new ApiError(500, "Something went wrong while registering the customer");
    }

    const newAddress = await Address.create(AddressDetails);

    if (!newAddress) {
        await customer.findByIdAndDelete(newCustomer._id);
        throw new ApiError(500, "Something went wrong while creating the address");
    }

    newCustomer.CustomerAdress = newAddress._id;
    await newCustomer.save();

    return res.status(201).json(
        new ApiResponse(200, newCustomer, "Customer registered successfully")
    );
});

export { registerCustomer };
