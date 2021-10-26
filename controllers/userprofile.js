const UserProfileRepository = require("../models/UserProfileRepository")

/**
 * Create UserProfile and CRUD details
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

exports.createUserProfile = async (req,res,next)=>{
    let {image, surName,firstName,otherName,sex,dateOfBirth,maritalStatus,phoneNumber,fatherName,motherName,spouse,offSpring } = req.body;
    let newUserProfile = {image, surName,firstName,otherName,sex,dateOfBirth,maritalStatus,phoneNumber,fatherName,motherName,spouse,offSpring }
    try{
        let userProfile = await UserProfileRepository.create(newUserProfile)
        return res.status(200).send({
            status:200,
            message: "User Profile Registered successfully",
            data: userProfile
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

exports.getUserProfileById = async (req,res,next)=>{
    let { profileId } = req.params;
    try{
        const userProfile = await UserProfileRepository.findById({_id: profileId})
        if(userProfile === null){
            return res.status(400).send({
                status: 404,
                message: `No profile found for id ${profileId}`,
                data: userProfile
            })
        }
        else{
            return res.status(200).send({
                status: 200,
                message: "User Profile Loaded Succefully",
                data: userProfile
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

exports.addWives =async (req,res,next) =>{
    let { profileId } = req.params;
    let {...payload}   = req.body;
    let Spouse = await UserProfileRepository.findOne({_id: profileId})
    if(Spouse){
        let update = await UserProfileRepository.upsert({_id: profileId}, {$push: {spouse: payload}})
        let data = await UserProfileRepository.findOne({_id: profileId})
        return res.status(200).send({
            status:200,
            message: "Wife Added Successfully",
            data: data 
        })
    }
    else{
        return res.status(404).send({
            status:404,
            message: "User Profile not found" 
        });
    }
}

exports.addOffSpring =async (req,res,next) =>{
    let { profileId } = req.params;
    let {...payload}   = req.body;
    let Offspring = await UserProfileRepository.findOne({_id: profileId})
    if(Offspring){
        let update = await UserProfileRepository.upsert({_id: profileId}, {$push: {offSpring: payload}})
        let data = await UserProfileRepository.findOne({_id: profileId})
        return res.status(200).send({
            status:200,
            message: "Wife Added Successfully",
            data: data 
        })
    }
    else{
        return res.status(404).send({
            status:404,
            message: "User Profile not found" 
        });
    }
}