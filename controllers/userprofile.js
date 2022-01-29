const mongoose = require("mongoose");
const UserProfileRepository = require("../models/UserProfileRepository");
const UserRelationshipRepository = require("../models/UserRelationshipRepository");
const EventRepository = require("../models/EventRepository");
const { createNewUser } = require("../Services/user");
const { sendMail } = require("../Services/mail")
const { ObjectId } = require("mongoose")

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

// Creating a UserProfile
exports.createUserProfile = async (req,res,next)=>{
    let {userId,image,surName,firstName,otherName,sex,dateOfBirth,maritalStatus,email } = req.body;
    let newUserProfile = {userId,image,surName,firstName,otherName,sex,dateOfBirth,maritalStatus,email }
    try{
        let userProfile = await UserProfileRepository.create(newUserProfile);
        return res.status(200).send({
            status:200,
            message: "User Profile Registered successfully",
            data: userProfile
        });
    }catch(err){
            console.log(err)
            return res.status(400).send({
            status:400,
            message: "Bad Request",
            error: err
            })
        }
    }


// Create Relationship 
exports.createUserRelationship = async (req,res,next)=>{
    let { name, email, userId, type } = req.body;
    let primaryUserId = userId
    let UserProfile = await UserProfileRepository.findOne({email:email})
    if (!UserProfile){
            let userId = await createNewUser(email)
            let userProfile = {firstName: name, email, userId}
            await UserProfileRepository.create(userProfile)
            let secondaryUserId = userId
            let userRelationship = {primaryUserId,secondaryUserId,type}
            let data = await UserRelationshipRepository.create(userRelationship)  
            return res.status(200).send({
                status:202,
                message: "Relationship added successfully",
                data: data
            })
        } 
    try{
        let secondaryUserId = UserProfile.userId
        let userRelationship = {primaryUserId,secondaryUserId,type}
        let data = await UserRelationshipRepository.create(userRelationship)  
        return res.status(200).send({
            status: 200,
            message: "Relationship added successfully",
            data: data
        }) 
    }catch(err){
        console.log(err)
        if(err.code == 11000){
            let error = err['errmsg'].split(':')[2].split(' ')[1].split('_')[0];
            res.status(500).send({
                message: `User Relationship Already Exist`,
                status: 500,
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



// Function to get Parent
exports.getUserParent = async (req,res,next)=>{
    let { userId } = req.params;
    try{
        let type = ["Father", "Mother"]
        let Relationship = await UserRelationshipRepository.all({primaryUserId: userId, $or: [{type: {$in: type}}]}) 
        let profile = [];
        Relationship.map( data =>{profile.push(data.secondaryUserId)})
        let parents = await UserProfileRepository.all({
            $or: [{userId: {$in: profile}}]
        }, {_id: -1}) 
    message = `Parent for Id ${userId} loaded successfully`
    return createSuccessResponse(res, parents ,message)
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
}


// Get User Sibling
exports.getUserSibling = async (req,res,next)=>{
    let {userId } = req.params
    try{
        let type = ["Sister", "Brother"]
        let Relationship = await UserRelationshipRepository.all({primaryUserId: userId, $or: [{type: {$in: type}}]}) 
        let profile = [];
        Relationship.map( data =>{profile.push(data.secondaryUserId)})
        let sibling = await UserProfileRepository.all({
            $or: [{userId: {$in: profile}}]
        }, {_id: -1}) 
        message = `Sibling for Id ${userId} loaded successfully`
        return createSuccessResponse(res, sibling ,message)
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        }) 
    };
};



// Get Children for UserId
exports.getUserChildren = async (req,res,next)=>{
    let {userId } = req.params
    try{
        let type = ["Son", "Daughter"]
        let Relationship = await UserRelationshipRepository.all({primaryUserId: userId, $or: [{type: {$in: type}}]}) 
        let profile = [];
        Relationship.map( data =>{profile.push(data.secondaryUserId)})
        let children = await UserProfileRepository.all({
            $or: [{userId: {$in: profile}}]
        }, {_id: -1}) 
        message = `Spouse for Id ${userId} loaded successfully`
        return createSuccessResponse(res, children ,message)
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        }) 
    };
};


// Function to get Spouse
exports.getUserSpouse = async (req,res,next)=>{
    let { userId } = req.params;
    try {
        let Relationship = await UserRelationshipRepository.all({userId: userId, type: "Spouse"})
        let profile = [];
        Relationship.map( data =>{profile.push(data.secondaryUserId)})
        let Spouse = await UserProfileRepository.all({
            $or: [{userId: {$in: profile}}]
        }, {_id: -1}) 
        message = `Spouse for Id ${userId} loaded successfully`
        return createSuccessResponse(res, Spouse ,message)   
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
}


// Getting a UserProfile by ID or any key
exports.getUserProfileById = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let userProfile = await UserProfileRepository.all(query, {_id: -1}, page, limit);
        if(userProfile.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No profile found for id ${profileId}`,
                data: userProfile
            })
        }
        else{
            message = `Profile for Id ${query} loaded successfully`
            return createSuccessResponse(res, userProfile ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
};

// Get Relationship By Type
exports.getRelationshipByType = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let userProfile = await UserRelationshipRepository.all(query, {_id: -1}, page, limit);
        if(userProfile.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No Relationship found for id ${query}`,
                data: userProfile
            })
        }
        else{
            message = `Relationship for ${query} loaded successfully`
            return createSuccessResponse(res, userProfile ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 404,
            message: "Not Found",
            error: err
        })
    }
};






