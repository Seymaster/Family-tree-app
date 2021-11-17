const FamilyRepository = require("../models/FamilyRepository")

exports.getNewUser = async (req,res,next) =>{
    let user = req.body
    let userId = user.data.userId
    console.log(userId)
    // finduser = await FamilyRepository.findOne({email: email})
    // console.log(finduser)
    await FamilyRepository.update({email: email},{userId: userId})
    family = await FamilyRepository.findOne({userId: userId})
    return res.status(200).send({
        status: 200,
        message: `family with ${email} updated successfully`,
        data: family
    })
}