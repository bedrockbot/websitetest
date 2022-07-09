const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000

const path = require('path')

const mongo = require("./mongo");
const robloxSchema = require("./schemas/roblox-schema");
const { Mongoose } = require("mongoose");

const  axios = require('axios');


let initialPath = path.join(path.join(process.env.PORT || 3000, ".."), "client")

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(express.static("public"))
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.sendFile(path.join(initialPath, "home.html"))
})

app.get('/api/roblox/users', async (req,res) => {
    if (!req.headers || !req.headers.authorization) {
        res.statusCode = 422
        res.send("no parameters")
        return;
    }
    var [access_token, token_type] = [req.headers.authorization.split(" ")[1], req.headers.authorization.split(" ")[0]]
    
    
    if (!access_token || !token_type) {
        res.statusCode = 422
        res.send("not enough parameters")
        return;
    }
    
    
	axios.get('https://discord.com/api/users/@me', {
		headers: {
			authorization: `${token_type} ${access_token}`,
		},
	})
    
	//.then(result => result.json())
	.then(async response => {
        let user
        await mongo().then(async (mongoose) => {
          
            user = await robloxSchema.findOne({
              _id: response.data.id,
            });
          })
          console.log(user)
        res.send(user)
	})
	.catch(console.error)
   
    
})
//Route that handles login logic
app.get('/login', (req, res) =>{
    res.sendFile(path.join(initialPath, "login.html"))
})

//Route that handles signup logic
app.get('/signup', (req, res) =>{
    res.sendFile(path.join(initialPath, "signup.html"))
})
app.get('/oauth2', (req, res) =>{
    
    res.sendFile(path.join(initialPath, "oauth2.html"))
})


//Start your server on a specified port
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is runing on port ${port}`)
})
