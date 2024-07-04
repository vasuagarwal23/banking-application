import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customerDetails.model.js";
import { EmploymentDetails } from "../models/employmentDetails.model.js";
import dotenv from 'dotenv';
dotenv.config();
const employmentDetail = asyncHandler(async (req, res) => {
    const { customerId, employmentStatus, typeOfIndustry, occupation, income, nationality, taxResident } = req.body;

    // Validate required fields
    if (
        [employmentStatus, typeOfIndustry, occupation, income, nationality, taxResident].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    try {
        // Find customer by ID
        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new ApiError(404, 'Customer not found');
        }

        // Create employment details
        const details = await EmploymentDetails.create({
            employmentStatus,
            typeOfIndustry,
            occupation,
            income,
            nationality,
            taxResident
        });

        // Check if details were created
        if (!details) {
            throw new ApiError(500, "Something went wrong while adding the employee details");
        }

        // Update customer's employmentDetails reference
        customer.employmentDetails = details._id;
        await customer.save();

        return res.status(201).json(
            new ApiResponse(200, details, "Employee details added successfully")
        );
    } catch (error) {
        console.error('Error adding employment details:', error);
        throw new ApiError(500, "Internal server error");
    }
});
export {employmentDetail};