const fetch = require("node-fetch");
const redirect_url = process.env.stagingRedirect
const baseUrl = process.env.mainbaseUrl
const clientId  = process.env.clientId
const clientSecret = process.env.clientSecret

// Create User API
async function createUser(email){
    let raw = { 
                "name":"Unnamed User",
                "email": email,
                "password":"pmb",
                "age":12,
                "dob":"15/01/2012",
                "anyOtherThing":"value",
                "anyOtherThing1":"value1",
                "parentId":"ffdc48ee-46da-434b-ae85-27f461798848",
                "options": { 
                            "verificationType":"email",  
                            "verification": true,
                            "redirectURL": "http://google.com"
                            }
        
    }

    let requestOptions = {
    method: 'POST',
    headers:{   "Accept": "application/json",
                "client-secret": clientSecret,
                "client-id": clientId,
                "Content-Type": "application/json"
    },
    body: JSON.stringify(raw),
    redirect: 'follow'
    };
    try{
        const response = await fetch(`${baseUrl}/users/v1/users`, requestOptions)
        return  {user:await response.text()};
    }
    catch(error){
        return {error};
    }

    // console.log(result);
}

async function findUser(email){
    let requestOptions = {
        method: 'GET',
        headers:{  
            "client-secret": clientSecret,
            "client-id": clientId,
            "Content-Type": "application/json"
        },
        redirect: 'follow'
        };
        try{
            const response = await fetch(`${baseUrl}/users/v1/users?email=${email}`, requestOptions)
            return  await response.text();
        }
        catch(error){
            return {error};
        }
}

async function createNewUser(email){
    try {
        let fetchUser = await findUser(email)
        fetchUser = JSON.parse(fetchUser)
        if(fetchUser.data.length === 0 ){
            let newUser = await createUser(email)
            newUser= JSON.parse(newUser.user)
            return newUser.data.user.userId
        }
        return fetchUser.data[0].userId 
    } catch(error) {
        return error
    }
}

// let email = "testhdh@tu0.com"
// createNewUser(email)
// .then(data=> console.log(data))
// .catch(err=> console.log(err))

module.exports = { createUser, findUser, createNewUser }