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


let initialPath = path.join(path.join(__dirname, ".."), "client")
// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(express.static(initialPath))
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())


app.get('/', (req, res)=>{
    res.sendFile(path.join(initialPath, "bedrockwebsite.html"))
})
app.get('/services', (req, res)=>{
    res.sendFile(path.join(initialPath, "services.html"))
})
app.get('/dashboard', (req, res)=>{
    res.sendFile(path.join(initialPath, "dashboard.html"))
})
app.get('/support', (req, res)=>{
    res.sendFile(path.join(initialPath, "support.html"))
})


app.get('/api/roblox/hubs', async (req,res) => {

})



app.get('/api/roblox/users', async (req,res) => {
    if (!req.headers || !req.headers.authorization || !req.headers.type) {
        res.statusCode = 422
        res.send("no parameters")
        return;
    }

    var type = req.headers.type
    if (type == "discord") {
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
    } else if (type == "roblox") {
        let user
        await mongo().then(async (mongoose) => {
          
            user = await robloxSchema.findOne({
                robloxid: req.headers.authorization,
            });

        })
        if (user) {
            res.send(true)
            
        } else {
            res.send(false)
        }
    }
    
   
    
})
app.get('/oauth2', (req, res) =>{
    res.sendFile(path.join(initialPath, "oauth2.html"))
    
})


//Start your server on a specified port
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is runing on port ${port}`)
})
