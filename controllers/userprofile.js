const UserProfileRepository = require("../models/UserProfileRepository")
const FamilyRepository = require("../models/FamilyRepository")
const { createUser } = require("../controllers/user");
const { sendMail } = require("./mail")

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
    let {userId,image,surName,firstName,otherName,sex,dateOfBirth,maritalStatus,email,fatherName,fatherEmail,motherName,motherEmail,spouse,offSpring } = req.body;
    let father = await FamilyRepository.findOne({email: fatherEmail})
    if(!father){
        let email = fatherEmail
        let name = fatherName
        let familyId = userId
        let newFamily = {name,email,familyId}
        await FamilyRepository.create(newFamily)
        let message = `You have been added as father for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
        await sendMail(email, message)
    }else{
        return res.status(403).send({
            status:403,
            message: "Father Already Exist for this User"
        })
    }
    let mother = await FamilyRepository.findOne({email: motherEmail})
    if(!mother){
        let email = motherEmail
        let name = motherName
        let familyId = userId
        let newFamily = {name,email,familyId}
        await FamilyRepository.create(newFamily)
        let message = `You have been added as Mother for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
        await sendMail(email, message)
    }else{
        return res.status(403).send({
            status:403,
            message: "Mother Already Exist for this User"
        })
    }
    if(spouse[0] != undefined){    
        let spouseEmail = spouse[0].email
        let findSpouse = await FamilyRepository.findOne({email: spouseEmail})
        if(!findSpouse){
            let email = spouseEmail
            let name = spouse[0].wives
            let familyId = userId
            let newFamily = {name,email,familyId}
            await FamilyRepository.create(newFamily)
            let message = `You have been added as Spouse for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
        await sendMail(email, message)
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
            let name = offSpring[0].firstName
            let parent = [{father: userId}]
            let email = offSpringEmail
            let familyId = userId
            let newFamily= {userId,name, email, parent,familyId }
            await FamilyRepository.create(newFamily)
            let message = `You have been added as Child for ${firstName} ${otherName} on our platform kindly visit our website to signup to complete your user registration`
            await sendMail(email, message)
        }else{
            return res.status(403).send({
                status:403,
                message: "This Offspring Already Exist for this User"
            })
        }
    }
    let newUserProfile = {userId,image,surName,firstName,otherName,sex,dateOfBirth,maritalStatus,email,fatherName,fatherEmail,motherName,motherEmail,spouse,offSpring }
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
                message: `${error.name} already exist`,
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
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let userProfile = await UserProfileRepository.all(query, {_id: -1}, page, limit)
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

// exports.updateEventRegistry = async (req, res, next) =>{
//     let { profileId } = req.params;
//     let {...payload} = req.body;
//     if(payload.user_id) delete payload.userId;
//     if(payload.image) delete payload.image
//     try{

//     }

// }

exports.getUserParent = async (req,res,next)=>{
    let { userId } = req.params;
    try{
        let Family = await FamilyRepository.findOne({userId: userId})
        let parent = Family.parent[0]
        if(parent === null){
            return res.status(404).send({
                status: 404,
                message: `No profile found for id ${userId}`,
                data: parent
            })
        }
        else{
            return res.status(200).send({
                status: 200,
                message: `Parent for User ${userId} Loaded Successfully`,
                data: parent
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

exports.getUserSpouse = async (req,res,next)=>{
    let { userId, partnerId } = req.params;
    try{
        let spouse = await FamilyRepository.all({userId: userId, "partner.wives._id": partnerId})
        if(spouse.docs.length === 0){
            return res.status(404).send({
                status: 404,
                message: `No profile found for id ${userId}`,
                data: spouse
            })
        }
        else{
            return res.status(200).send({
                status: 200,
                message: `Spouse for User ${userId} Loaded Successfully`,
                data: spouse
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

exports.getUserOffSpring = async (req,res,next)=>{
    let { userId } = req.params;
    try{
        let Family = await FamilyRepository.all({"parent.father" : userId})
        if(Family.docs.length === 0){
            return res.status(404).send({
                status: 404,
                message: `No profile found for id ${userId}`,
                data: Family
            })
        }
        else{
            return res.status(200).send({
                status: 200,
                message: `Offspring for User ${userId} Loaded Successfully`,
                data: Family
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
    console.log(Spouse)
    let userId = Spouse.userId
    if(Spouse){
        let spouseEmail = payload.email
        let findSpouse = await FamilyRepository.findOne({userId: userId, email: spouseEmail})
        if(!findSpouse){
            let { user } = await createUser(spouseEmail)
            user = JSON.parse(user);
            if(user.error){
                return res.status(403).send({
                    status:403,
                    message: user
                })
            }
            user = user.data
            const spouseUserId = user.user.userId;
            let name = payload.wives
            let partner = [{wives: spouseUserId}]
            let parent = null
            let email = spouseEmail
            let newFamily= {userId,name, email, partner, parent }
            await FamilyRepository.create(newFamily)
        }else{
            return res.status(403).send({
                status:403,
                message: "This Spouse Already Exist for this User"
            })
        }
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


exports.addOffSpring =async (req,res,next) =>{
    let { profileId } = req.params;
    let {...payload}   = req.body;
    let Offspring = await UserProfileRepository.findOne({_id: profileId})
        if(Offspring){
            let offSpringEmail = payload.email
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
                let name = payload.firstName
                let userId = payload.userId
                let partner = null
                let parent = [{father: userId}]
                let email = offSpringEmail
                let newFamily= {userId,name, email, partner, parent }
                await FamilyRepository.create(newFamily)
            }else{
                return res.status(403).send({
                    status:403,
                    message: "This Offspring Already Exist for this User"
                })
            }
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

// exports.getfamilytree = async (req,res,next)=>{
//     let { userId } = req.params;
//     try{
//         let Parent = await FamilyRepository.all({userId: userId})
//         // parent = Parent.parent[0]
//         return res.status(200).send({
//             data: Parent
//         })
//     }catch(err){
//         console.log(err)
//         return res.status(400).send({
//             status: 404,
//             message: "Not Found",
//             error: err
//         })
//     }
// }

exports.getBirthday = async (req, res, next)=>{
    let {...query} = req.params
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let allFamily = await FamilyRepository.all(query)
        let userIds = []
        allFamily.map(data =>{
            userIds.push(
            data.userId)
        })
        let dob = await UserProfileRepository.all({
            $or: [{userId: {$in: userIds}}]
        }, {_id: -1}, page, limit) 
        // dob = dob.docs
        // let birthday = []
        // dob.map(data =>{
        //     birthday.push(
        //         data.dateOfBirth
        //     )
        // })
        // console.log(birthday)
        message = `Profiles for familyId ${query.familyId} loaded successfully`
        return createSuccessResponse(res, dob ,message)
    }catch(error){
        console.log(error)
        return res.status(400).send({
            status:400,
            message: "Error",
            error: error   
        });
    }
}