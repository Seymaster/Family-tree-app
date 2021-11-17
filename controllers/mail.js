// Email Notification API

const fetch = require("node-fetch");
// const redirect_url = process.env.stagingRedirect
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret

async function sendMail(recipient,message){
    var raw = JSON.stringify({
        "from": "no-reply@owambe.ng",
        "subject": "Uwa Family Platform",
        "recipients": [
            recipient
        ],
        "header": {
            "title": "Uwa Family",
            "bgColor": "",
            "appName": "Owambe",
            "appURL": "",
            "appLogo": ""
        },
        // "content": "Inside Content: <br>Testing email content<br> <p>KKD</p>",
        "body": {
            "content": message,
            "greeting": "Hello,",
            // "introLines": [
                
            // ],
            "outroLines": [
                // `${redirect_url}`,
                "2. Still below button or rather main content"
            ]
        },
        // "button": {
        //     "level": "success",
        //     "actionUrl": `${url}`,
        //     "actionText": "Click to checkout"
        // },
        // "attachments": [
        //     {
        //         "type":"url",
        //         "filename":"data.pdf",
        //         "data": "https://res.cloudinary.com/tm30global/image/upload/v1582900669/4bb79409937716d8db9855e49cc7a9b6.pdf"
        //     }
        // ]
    });

    var requestOptions = {
    method: 'POST',
    headers:  {
                "Accept": "application/json",
                "Content-Type":"application/json",
                "client-id": clientId,
                "client-secret": clientSecret
            },
    body: raw,
    redirect: 'follow'
    };
    await fetch(`${baseUrl}/notifications/v1/email`,requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


// let recipient = "alugbinoluwaseyi1@gmail.com"
// let url = "Img001"
// let message = "Hello"

// BookMail(recipient,url,message)
// .then(data=>{
//         console.log(data)
//     }).catch(err =>{
//         console.log(err)
//     })



module.exports = { sendMail }
