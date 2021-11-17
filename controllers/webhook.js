exports.getNewUser = async (req,res,next) =>{
    let user = req.body
    user = JSON.parse(user)
    console.log(user)
    return res.status(200).send({
        status: 200,
        message: "Webhook returned successfully",
        data: user
    })
}