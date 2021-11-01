const Joi = require("joi");

// const pattern = /^[a-zA-Z0-9]*$/
const eventSchema = {
    eventPost: Joi.object().keys({
        userId: Joi.string().required(),
        eventName: Joi.string().required(),
        eventType: Joi.string().required(),
        eventLocation: Joi.string().required(),
        eventDate: Joi.string().optional(),
        eventEndDate: Joi.string().required(),
        eventDesc: Joi.string().required(),
        eventImages: Joi.string().required(),
    })
    // .options({ allowUnknown: true })
}

const userProfileSchema = {
    userProfilePost: Joi.object().keys({
        userId: Joi.string().required(),
        image: Joi.string().required(),
        surName: Joi.string().required(),
        firstName: Joi.string().required(),
        otherName: Joi.string().required(),
        sex: Joi.string().required(),
        dateOfBirth: Joi.string().required(),
        maritalStatus: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        fatherName: Joi.string().required(),
        motherName: Joi.string().required(),
        spouse: Joi.array().required().items(
            Joi.object().keys({
                wives: Joi.string().required()
        })),
        offSpring: Joi.array().required().items(
            Joi.object().keys({
                firstName: Joi.string().required(),
                middleName: Joi.string().required(),
                lastName: Joi.string().required(),
                placeOfBirth: Joi.string().required(),
                occupation: Joi.string().required()
        }))
    })
}
module.exports = { eventSchema, userProfileSchema}