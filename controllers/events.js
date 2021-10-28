const EventRepository = require("../models/EventRepository")

/**
 * Create Event and CRUD details
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */


exports.createEvent = async (req,res,next)=>{
    let {userId, eventName, eventType, eventLocation, eventDate, eventEndDate, eventDesc, eventImage} = req.body;
    let newEvent = {userId, eventName, eventType, eventLocation, eventDate, eventEndDate, eventDesc, eventImage};
    try{
        let event = await EventRepository.create(newEvent)
        return res.status(200).send({
            status:200,
            message: "Event Registered successfully",
            data: event
        });
    }catch(err){
        console.log("here2")
        if(err.code == 11000){
            let error = err['errmsg'].split(':')[2].split(' ')[1].split('_')[0];
            res.status(500).send({
                message: `${error} already exist`,
                status: 11000,
                error: error
            });
        }else{
            console.log(err)
            return res.status(400).send({
            status:400,
            message: "Bad Request",
            error: err
                })
            }
        };
}

exports.getEventById = async (req,res,next)=>{
    let { profileId } = req.params;
    try{
        const event = await EventRepository.findById({_id: profileId})
        if(event === null){
            return res.status(400).send({
                status: 404,
                message: `No Event found for id ${profileId}`,
                data: event
            })
        }
        else{
            return res.status(200).send({
                status: 200,
                message: "Event Loaded Succefully",
                data: event
            })
        }
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err.name
        })
    }
};