const UserRelationshipRepository = require("../models/UserRelationshipRepository")

exports.getNewUser = async (req,res,next) =>{
    let user = req.body
    let userId = user.data.userId
    let email = user.data.email
    console.log(userId, email)
    // finduser = await UserRelationshipRepository.findOne({email: email})
    // console.log(finduser)
    await UserRelationshipRepository.update({email: email},{userId: userId})
    userRelationship = await UserRelationshipRepository.findOne({userId: userId})
    return res.status(200).send({
        status: 200,
        message: `UserRelationship with ${email} updated successfully`,
        data: UserRelationship
    })
}