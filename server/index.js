const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000

const fs = require('fs')
const path = require('path')

const mongo = require("./mongo");
const robloxSchema = require("./schemas/roblox-schema");
const settingsSchema = require('./schemas/settings-schema')
const { Mongoose } = require("mongoose");

const  axios = require('axios');

const commandsPath = path.join(__dirname, 'events/commands');
const applicationPath = path.join(__dirname, 'events/applications');
const EventsPath = path.join(__dirname, 'events');

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


app.use(express.static(path.join(path.join(__dirname, ".."), "client"),{index:false,extensions:['html']}));

app.get('/oauth2', (req, res) =>{
    res.sendFile(path.join(initialPath, "oauth2.html"))
    
})


//Start your server on a specified port
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is runing on port ${port}`)
})

//Discord setup
const Discord = require('discord.js');

const client = new Discord.Client(
    {
        intents: [
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.DirectMessages,
            Discord.GatewayIntentBits.Guilds
        ]
    }
)

client.on('ready', () => {
    console.log("Discord Bot online")

    const supportfile = require(path.join(EventsPath,"buttons", "support.js"))
    //supportfile.sendsupportmessage(client, "726165597502832692")
    supportfile.slashcommandinit(client)

})

//check when bot comes online
client.on('ready', async () => {
    //Setup listener for the api path
    app.post('/api/core/submit', async (req,res) => {
        const main = require(path.join(applicationPath, "main.js"))
        try {
            await main.submit(req,res,client);
        } catch (error) {
            console.error(error);
            res.sendStatus(500)
        }

    })
})
