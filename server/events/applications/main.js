const mongo = require("../../mongo");
const settingsSchema = require('../../schemas/settings-schema')
const { EmbedBuilder } = require('discord.js')

module.exports = {



    async submit(req, res, client) {
        if (!req.headers || !req.body || !req.headers['content-type']) {
            res.sendStatus(422)
            return;
        }
        
        //check that the application exists
        /*
        Data structure
        req.headers.data = {
            "hubid": "bedrockhub_1dajdw819sassdawdbd21",
            "applicationid": "bedrockapp_adwa9wd1sdadwa8wd2",
            "applicationresponse": [
                "",
                ""
                    
            ],
            "user": {
                "username": "",
                "rId": ""
            }
        }

        */
        let data = req.body
        let hub
        await mongo().then(async (mongoose) => {
            hub = await settingsSchema.findOne({
            _id: data.hubid,
            });
        })
        if (!hub) {
            res.sendStatus(404)
            return;
        }
        const test = ["   ", "531", " "]
        if (hub.settings.discordchannel && hub.settings.discordchannel) {
            //console.log(hub.settings.discordchannel)
            
            var applicationembed = new EmbedBuilder().setTitle("New application")
            
            let c = 0
            console.log(hub.applications[data.applicationid])
            data.applicationresponse.forEach(v => {
                console.log(hub.applications[data.applicationid].questions[c].question)
                applicationembed.addFields([{"name": hub.applications[data.applicationid].questions[c].question, "value": v}])
                c++

            })

            client.channels.cache.get(hub.settings.discordchannel).send({"embeds": [applicationembed]})

        }
        res.sendStatus(200)
    },
};
