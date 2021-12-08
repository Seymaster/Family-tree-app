const EventRepository = require("../models/EventRepository")

/**
 * Create Event and CRUD details
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */

 global.createSuccessResponse = (res, data, message, code= 200, isPaginated = false) => {
    if (isPaginated || (data && data.docs)) {
        data.data = data.docs;
        delete data.docs;
        delete data.pages
        delete data.limit
        data.status = code
        data.message = message;
        data.page = parseInt(data.page);
        return res.status(code).json(data);
    }
    return res.status(code).json({data});
};


exports.createEvent = async (req,res,next)=>{
    let {userId, title, eventType, eventLocation, start, end, eventDesc, eventImage} = req.body;
    let newEvent = {userId, title, eventType, eventLocation, start, end, eventDesc, eventImage};
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
    let { eventId } = req.params;
    try{
        const event = await EventRepository.findById({_id: eventId})
        if(event === null){
            return res.status(400).send({
                status: 404,
                message: `No Event found for id ${eventId}`,
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

exports.getEvent = async (req,res,next)=>{
    let {page,limit, ...query} = req.query;
    if(query.user_id) delete query.user_id;
    page = page || 1;
    limit = limit || 100;
    const event = await EventRepository.all(query, {_id: -1}, page, limit);;
    if(event.docs.length === 0){
        return res.status(200).send({
            status: 404,
            message: "Not Found",
            data: event
        })
    }else{
        let message = "Event Loaded Successfully"
        return createSuccessResponse(res, event, message);
    }
};