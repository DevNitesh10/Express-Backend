/* 
street
city
state
zipcode
country
country code
phone
*/

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        // required: true,
        trim: true
    },
    city: {
        type: String,
        // required: true,
        trim: true
    },
    state: {
        type: String,
        // required: true,
        trim: true
    },
    zipcode: {
        type: String,
        // required: true,
        trim: true
    },
    country: {
        type: String,
        // required: true,
        trim: true
    },
    countryCode: {
        type: String,
        // required: true,
        trim: true
    },
    phone: {
        type: String,
        // required: true,
        trim: true
    }
}, {timestamps: true})


module.exports = mongoose.model("Address", addressSchema)