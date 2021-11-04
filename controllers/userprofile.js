const UserProfileRepository = require("../models/UserProfileRepository")
const FamilyRepository = require("../models/FamilyRepository")
const { createUser } = require("../controllers/user");
const Family = require("../models/Family");

/**
 * Create UserProfile and CRUD details
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */


exports.createUserProfile = async (req,res,next)=>{
    let {userId,image,surName,firstName,otherName,sex,dateOfBirth,maritalStatus,email,fatherName,fatherEmail,motherName,motherEmail,spouse,offSpring } = req.body;
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
        const fatherUserId = user.user.userId;
        let name = fatherName
        let parent = [{father: fatherUserId}]
        let email = fatherEmail
        let partner = null
        let newFamily = {userId, name, email,partner, parent }
        await FamilyRepository.create(newFamily)
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
        const motherUserId = user.user.userId;
        let Family = await FamilyRepository.findOne({email: fatherEmail})
        let familyId = Family.id
        let parentId = Family.parent[0].id
        await FamilyRepository.update({id: familyId, "parent._id": parentId }, {$set: {"parent.$.mother": motherUserId}})
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
            let name = spouse[0].wives
            let partner = [{wives: spouseUserId}]
            let parent = null
            let email = spouseEmail
            let newFamily= {userId,name, email, partner, parent }
            await FamilyRepository.create(newFamily)
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
            let name = offSpring[0].firstName
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
        if(spouse === null){
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
        // let Family = await FamilyRepository.findOne({parent :{"$in": userId}})
        if(Family === null){
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