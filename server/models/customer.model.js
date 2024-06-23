import mongoose, { Schema } from "mongoose";

function validateAge(value) {
    const [day, month, year] = value.split('/');
    const dob = new Date(year, month - 1, day);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 18;
}

//customer schema
const customerSchema = new Schema(
    {
        //customer personal details
        FirstName: {
            type: String,
            required: [true, 'First name is required'],
            match: [/^[a-zA-Z]+$/, 'First name can only contain letters']
        },
        MiddleName: {
            type: String,
            match: [/^[a-zA-Z]*$/, 'Middle name can only contain letters']
        },
        LastName: {
            type: String,
            required: [true, 'Last name is required'],
            match: [/^[a-zA-Z]+$/, 'First name can only contain letters']
        },
        Email: {
            type: String,
            required: [true, 'Email is required'],
        },
        DateOfBirth: {
            type: String,
            required: [true, 'Date of birth is required'],
            match: [/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Date of birth must be in the format DD/MM/YYYY'],
            validate: {
                validator: validateAge,
                message: 'Age must be 18 years or older'
            }
        },
        //customer home address
        CustomerAdress: {
            type: Schema.Types.ObjectId,
            ref: "Address"
        },
        currentAddressDuration: {
            type: String,
            enum: ['6 months or more', 'Less than 6 months'],
            required: [true, 'Duration at current address is required']
        },

        // Previous address details if duration is less than 6 months(ToDO)


    },
    {
        timestamps: true
    }
);
export const customer = mongoose.model("Customer", customerSchema);