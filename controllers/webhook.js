exports.allEvent = async (req,res,next) =>{
    let data = req.body
    console.log(data)
    return res.status(200).send({
        status: 200,
        message: "Webhook returned successfully",
        data: data
    })
}