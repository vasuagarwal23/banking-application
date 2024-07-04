import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PersonalDetails } from "../models/personalDetails.model.js";
import { Customer } from "../models/customerDetails.model.js";

const createPersonalDetails = asyncHandler(async (req, res) => {
    const { firstName, lastName, dateOfBirth, flatOrBuildingNumber, streetName, townOrCity, stateOrRegion, postcode, country, currentAddressDuration } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !flatOrBuildingNumber || !streetName || !townOrCity || !stateOrRegion || !postcode || !country || !currentAddressDuration) {
        throw new ApiError(400, 'All required fields must be provided');
    }

    try {
        const personalDetails = new PersonalDetails(req.body);
        await personalDetails.save();

        const customer = new Customer({ personalDetails: personalDetails._id });
        await customer.save();

        res.status(201).json(new ApiResponse('Personal details created', { customerId: customer._id }));
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new ApiError(400, error.message);
        } else {
            throw new ApiError(500, 'An unexpected error occurred');
        }
    }
});

export { createPersonalDetails };
