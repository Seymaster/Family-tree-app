const mongoose = require("mongoose");
const UserProfileRepository = require("../models/UserProfileRepository");
const UserRelationshipRepository = require("../models/UserRelationshipRepository");
const EventRepository = require("../models/EventRepository");
const { createUser, findUser } = require("../Services/user");
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
    let {
        userId,
        image,
        surName,
        firstName,
        otherName,
        sex,
        dateOfBirth,
        maritalStatus,
        email } = req.body;
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
            let user = await createUser(email);
            user= user.user
            user = JSON.parse(user);
            if(user.error){
                return res.status(403).send({
                    status:403,
                    message: user
                })
            }
            user = user.data
            let userId = user.user.userId
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
            status:202,
            message: "Relationship added successfully",
            data: data
        }) 
    }catch(err){
        console.log(err)
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



// Function to get Parent
async function getParent(userId){
    try{
        let user = await UserRelationshipRepository.findOne({userId: userId}) 
        let parent = [user.parentMother, user.parentFather]
        let parents = await UserRelationshipRepository.all({
            $or: [{userId: {$in: parent}}]
        }, {_id: -1}) 
    return parents
    }catch(err){
        return err 
    }
}





async function getSibling(userId){
    try {
        let user = await UserRelationshipRepository.findOne({userId: userId})
        let father = user.fatherEmail
        let mother = user.motherEmail
        let parent = await UserRelationshipRepository.all({userId: father, userId: mother})
        return parent
    } catch (error) {
        return error
    }
}

// Function to get Spouse
async function getSpouse(userId){
    try {
        let user = await UserRelationshipRepository.findOne({userId: userId})
        let spouse = user.spouse
        let Spouse = await UserRelationshipRepository.all({userId: spouse})
        return Spouse
    } catch (error) {
        return error
    }
}

// Function to get Children
async function getChildren(userId){
    try {
        let children = await UserRelationshipRepository.all({parentFather: userId})
        return children
    } catch (error) {
        return error
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


// Creating a UserRelationship Tree
exports.getUserRelationshipTree= async (req,res,next)=>{
   // query: select all users
   let { userId } = req.params;
   let user = await UserRelationshipRepository.findOne({userId})
   if(!user){
        return res.status(404).send({
            status:404,
            message: "No UserRelationship Tree for this user" 
        });
   }
   let children = await getChildren(userId)
   let listUsers = [user.userId, user.parentFather,user.parentMother,user.spouse]
   children.map(data =>{listUsers.push(data.userId)}) 
   let users = await UserRelationshipRepository.all({
                $or: [{userId: {$in: listUsers}}]
            })
    let treeUsers =  [];
    // iterate through users - 
    users.map( async element => {
        treeUsers.push({"userId": element.userId,
                         "name": element.name,
                         "gender": element.gender,
                         "parents": [],
                         "spouses": [],
                         "children": []  
                        })
            })
        // console.log(treeUsers)
        return res.status(200).send({
            status: 200,
            message: "UserRelationship tree return succesfully",
            data:treeUsers
        })
    }



