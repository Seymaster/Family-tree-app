const Joi = require("joi");

// const pattern = /^[a-zA-Z0-9]*$/
const eventSchema = {
    eventPost: Joi.object().keys({
        userId: Joi.string().required(),
        eventName: Joi.string().required(),
        eventType: Joi.string().required(),
        eventLocation: Joi.string().required(),
        start: Joi.string().required(),
        end: Joi.string().required(),
        eventDesc: Joi.string().required(),
        eventImage: Joi.string().optional(),
    })
    // .options({ allowUnknown: true })
}

const userProfileSchema = {
    userProfilePost: Joi.object().keys({
        userId: Joi.string().required(),
        image: Joi.string().required(),
        surName: Joi.string().required(),
        firstName: Joi.string().required(),
        otherName: Joi.string().optional(),
        sex: Joi.string().required(),
        dateOfBirth: Joi.string().required(),
        maritalStatus: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        fatherName: Joi.string().required(),
        fatherEmail: Joi.string().required(),
        motherName: Joi.string().required(),
        motherEmail: Joi.string().required(),
        spouse: Joi.array().required().items(
            Joi.object().keys({
                wives: Joi.string().optional(),
                email: Joi.string().email().optional()
        })),
        offSpring: Joi.array().required().items(
            Joi.object().keys({
                firstName: Joi.string().optional(),
                middleName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                placeOfBirth: Joi.string().optional(),
                occupation: Joi.string().optional(),
                email: Joi.string().email().optional()
        }))
    })
}// .options({ allowUnknown: true })

module.exports = { eventSchema, userProfileSchema}