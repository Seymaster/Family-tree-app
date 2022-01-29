const mongoose = require("mongoose");
const UserProfileRepository = require("../models/UserProfileRepository");
const FamilyRepository = require("../models/FamilyRepository");
const EventRepository = require("../models/EventRepository");
const { createUser } = require("../controllers/user");
const { sendMail } = require("./mail")
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
        email,
        fatherName,
        fatherEmail,
        motherName,
        motherEmail,
        spouse,
        offSpring } = req.body;
    let father = await FamilyRepository.findOne({email: fatherEmail})
    if(!father){
        let { user } = await createUser(fatherEmail)
        user = JSON.parse(user);
        if(user.error){
            return res.status(403).send({
                status:403,
                message: user
            })
        }
        user = user.data
        let userId = user.user.userId;
        let name = fatherName
        let email = fatherEmail
        let gender = "male"
        let newFamily = {userId, name, email,gender }
        await FamilyRepository.create(newFamily)
        // let message = `You have been added as father for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
        // await sendMail(email, message)
    }else{
        return res.status(403).send({
            status:403,
            message: "Father Already Exist for this User"
        })
    }
    let mother = await FamilyRepository.findOne({email: motherEmail})
    if(!mother){
        let { user } = await createUser(motherEmail)
        user = JSON.parse(user);
        if(user.error){
            return res.status(403).send({
                status:403,
                message: user
            })
        }
        user = user.data
        let userId = user.user.userId;
        let name = motherName
        let email = motherEmail
        let gender = "female"
        let newFamily = {userId, name, email,gender }
        await FamilyRepository.create(newFamily)
        // let message = `You have been added as Mother for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
        // await sendMail(email, message)
    }else{
        return res.status(403).send({
            status:403,
            message: "Mother Already Exist for this User"
        })
    }
    if(spouse[0] != undefined){
        let spouseEmail = spouse[0].email
        let Spouse = await FamilyRepository.findOne({email: spouseEmail})
        if(!Spouse){
            let { user } = await createUser(spouseEmail)
            user = JSON.parse(user);
            if(user.error){
                return res.status(403).send({
                    status:403,
                    message: user
                })
            }
            user = user.data
            let userId = user.user.userId;
            let name = spouse[0].wives
            let email = spouseEmail
            let gender = "Female"
            let newFamily = {userId, name, email,gender }
            await FamilyRepository.create(newFamily)
            // let message = `You have been added as Spouse for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
            // await sendMail(email, message)
        }else{
            return res.status(403).send({
                status:403,
                message: "Spouse Already Exist for this User"
            })
        }
    }
    if(offSpring[0] != undefined){
        let offSpringEmail = offSpring[0].email
        let findOffSpring = await FamilyRepository.findOne({email: offSpringEmail})
        if(!findOffSpring){
            let { user } = await createUser(offSpringEmail)
            user = JSON.parse(user);
            if(user.error){
                return res.status(403).send({
                    status:403,
                    message: user
                })
            }
            user = user.data
            let userId = user.user.userId;
            let name = offSpring[0].firstName
            let email = offSpringEmail
            let parentFather = req.body.userId
            let gender = "male"
            let newFamily = {userId, name, email,gender,parentFather}
            await FamilyRepository.create(newFamily)
            // let message = `You have been added as Child for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
            // await sendMail(email, message)
        }else{
            return res.status(403).send({
                status:403,
                message: "This Offspring Already Exist for this User"
            })
        }
    }
    let getFather = await FamilyRepository.findOne({email: fatherEmail})
    let getMother = await FamilyRepository.findOne({email: motherEmail})
    let spouseEmail = spouse[0].email
    let Spouse = await FamilyRepository.findOne({email: spouseEmail})
    let dadUserId = getFather.userId
    let momUserId = getMother.userId
    let wifeUserId = Spouse.userId
    let newFamily = {
        userId: userId,
        name: surName,
        email: email,
        gender: sex,
        parentFather: dadUserId,
        parentMother: momUserId,
        spouse: wifeUserId
    }
    await FamilyRepository.create(newFamily)
    let newUserProfile = {userId,image,surName,firstName,otherName,sex,dateOfBirth,maritalStatus,email,fatherName,fatherEmail,motherName,motherEmail,spouse,offSpring }
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

// Function to get Parent
async function getParent(userId){
    try{
        let user = await FamilyRepository.findOne({userId: userId}) 
        let parent = [user.parentMother, user.parentFather]
        let parents = await FamilyRepository.all({
            $or: [{userId: {$in: parent}}]
        }, {_id: -1}) 
    return parents
    }catch(err){
        return err 
    }
}





async function getSibling(userId){
    try {
        let user = await FamilyRepository.findOne({userId: userId})
        let father = user.fatherEmail
        let mother = user.motherEmail
        let parent = await FamilyRepository.all({userId: father, userId: mother})
        return parent
    } catch (error) {
        return error
    }
}

// Function to get Spouse
async function getSpouse(userId){
    try {
        let user = await FamilyRepository.findOne({userId: userId})
        let spouse = user.spouse
        let Spouse = await FamilyRepository.all({userId: spouse})
        return Spouse
    } catch (error) {
        return error
    }
}

// Function to get Children
async function getChildren(userId){
    try {
        let children = await FamilyRepository.all({parentFather: userId})
        return children
    } catch (error) {
        return error
    }
}

// Getting a UserProfile by ID or any key
exports.getUserProfileById = async (req,res,next)=>{
    console.log(req.query);
    console.log(req.id);
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let userProfile = await UserProfileRepository.all(query, {_id: -1}, page, limit);
        // console.log(userProfile);
        
        // let fatherName = userProfile.data.fatherName
        // let motherName = userProfile.data.motherName
        // let parent = [
        //     {"fatherName": fatherName},
        //     {"motherName": motherName}
        // ] 
        // userProfile["parent"] = parent
        // delete userProfile.data.fatherName
        // delete userProfile.data.fatherEmail
        // delete userProfile.data.motherName
        // delete userProfile.data.motherEmail
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



// Adding Spouse to an Existing UserProfile
exports.addWives =async (req,res,next) =>{
    let { profileId } = req.params;
    let {...payload}   = req.body;
    let spouseEmail = payload.email
    let User = await UserProfileRepository.findOne({_id: profileId})
    if(!User){
        return res.status(404).send({
            status:404,
            message: "User not found"
        }) 
    }
        let Spouse = await FamilyRepository.findOne({email: spouseEmail})
        if(!Spouse){
            let { user } = await createUser(spouseEmail)
            user = JSON.parse(user);
            if(user.error){
                return res.status(403).send({
                    status:403,
                    message: user
                })
            }
            user = user.data
            let userId = user.user.userId;
            let name = payload.wives
            let email = payload.email
            let gender = "Female"
            let newFamily = {userId, name, email,gender }
            await FamilyRepository.create(newFamily)
//             let message = `You have been added as Spouse on our platform kindly visit our website to signup to complete your user registration`
//             await sendMail(spouseEmail, message)
            await UserProfileRepository.upsert({_id: profileId}, {$push: {spouse: payload}})
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

// Adding Children to an Existing UserProfile
exports.addOffSpring =async (req,res,next) =>{
    let { profileId } = req.params;
    let {...payload}   = req.body;
    let offSpringEmail = payload.email
    let User = await UserProfileRepository.findOne({_id: profileId})
        if(!User){
            return res.status(404).send({
                status:404,
                message: "User not found"
            }) 
        }
        let findOffSpring = await FamilyRepository.findOne({email: offSpringEmail})
        if(!findOffSpring){
            let { user } = await createUser(offSpringEmail)
            user = JSON.parse(user);
            if(user.error){
                return res.status(403).send({
                    status:403,
                    message: user
                })
            }
            user = user.data
            let userId = user.user.userId;
            let name = payload.firstName
            let email = offSpringEmail
            let parentFather = User.userId
            let gender = "male"
            let newFamily = {userId, name, email,gender,parentFather}
            await FamilyRepository.create(newFamily)
//                 let message = `You have been added as Spouse on our platform kindly visit our website to signup to complete your user registration`
//                 await sendMail(email, message)
            await UserProfileRepository.upsert({_id: profileId}, {$push: {offSpring: payload}})
            let data = await UserProfileRepository.findOne({_id: profileId})
            return res.status(200).send({
                status:200,
                message: "OffSpring Added Successfully",
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


// Creating a Family Tree
exports.getFamilyTree= async (req,res,next)=>{
   // query: select all users
   let { userId } = req.params;
   let user = await FamilyRepository.findOne({userId})
   if(!user){
        return res.status(404).send({
            status:404,
            message: "No Family Tree for this user" 
        });
   }
   let children = await getChildren(userId)
   let listUsers = [user.userId, user.parentFather,user.parentMother,user.spouse]
   children.map(data =>{listUsers.push(data.userId)}) 
   let users = await FamilyRepository.all({
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
            message: "Family tree return succesfully",
            data:treeUsers
        })
    }




































// exports.getBirthday = async (req, res, next)=>{
//     let {...query} = req.params
//     let {page,limit } = req.query;
//     page = page || 1;
//     limit = limit || 100;
//     try{
//         let allFamily = await FamilyRepository.all(query)
//         let userIds = []
//         allFamily.map(data =>{
//             userIds.push(
//             data.userId)
//         })
//         let dob = await UserProfileRepository.all({
//             $or: [{userId: {$in: userIds}}]
//         }, {_id: -1}, page, limit) 
//         // dob = dob.docs
//         // let birthday = []
//         // dob.map(data =>{
//         //     birthday.push(
//         //         data.dateOfBirth
//         //     )
//         // })
//         // console.log(birthday)
//         message = `Profiles for familyId ${query.familyId} loaded successfully`
//         return createSuccessResponse(res, dob ,message)
//     }catch(error){
//         console.log(error)
//         return res.status(400).send({
//             status:400,
//             message: "Error",
//             error: error   
//         });
//     }
// }}