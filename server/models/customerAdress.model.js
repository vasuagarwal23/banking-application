import mongoose, { Schema } from "mongoose";
const AddressSchema = new Schema({
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
    streetName: {
        type: String
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
    }

});
export const Address=mongoose.model("Address",AddressSchema);