exports.getNewUser = async (req,res,next) =>{
    let user = req.body
    console.log(user.data)
    return res.status(200).send({
        status: 200,
        message: "User Created successfully",
        data: user.data
    })
}