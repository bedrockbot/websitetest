const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000

const fs = require('fs')
const path = require('path')

const mongo = require("./mongo");
const robloxSchema = require("./schemas/roblox-schema");
const { Mongoose } = require("mongoose");

const  axios = require('axios');

var session = require('express-session')
const res = require('express/lib/response')
app.use(session({ secret: "bedrocksession_!9=3ad9ha80idhw082h8q0ndba8whd98u2qaobdpswauwbd", cookie: { maxAge: 60000000 }}))

let initialPath = path.join(path.join(__dirname, ".."), "client")
// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use(express.static(initialPath))
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())


app.get('/', (req, res)=>{
    res.sendFile(path.join(initialPath, "bedrockwebsite.html"))
})

app.get('/api/roblox/hubs', async (req,res) => {

})

app.get("/hub/:hubid?/:appid?", (req, res) => {
    if (req.params.appid) {
        res.sendFile(path.join(initialPath, "applications.html"))
    } else if (req.params.hubid) {
        res.sendFile(path.join(initialPath, "hub.html"))
    } else {
        res.send("Unable to get hub null")
    }
})

app.get("/files/BedrockBotApps.rbxlx", (req, res) => {
    if (req.query.hubid) {
        fs.readFile('huboriginal.rbxlx', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
                //return res.sendStatus(500)
            }
            var result = data.replace(/REPLACEMENTGOESHERE/g, 'require(6056574105)("' + req.query.hubid + '")');
            fs.writeFile('BedrockBotApplicationHub.rbxlx', result, 'utf8', function (err) {
               if (err) return console.log(err); //return res.sendStatus(500);
               res.sendFile(__dirname + '/BedrockBotApplicationHub.rbxlx')
            });
        });
        
    } else {
        res.sendStatus(400)
    }
    
})

app.use(express.static(path.join(path.join(__dirname, ".."), "client"),{index:false,extensions:['html']}));

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
        if (req.session.duser) {
            if (req.session.ruser) {
                return req.session.ruser
            }
            let user
            await mongo().then(async (mongoose) => {
              
                user = await robloxSchema.findOne({
                  _id: response.data.id,
                });
              })
            
            res.send(user)
            req.session.ruser = user
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
                res.send(user)
                req.session.ruser = user
                req.session.duser = response.data
                req.session.save()
            }).catch(error => {
                req.session.duser = response.data
                console.log(error)
            })
            
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
