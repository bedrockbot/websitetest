const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js')

const supportrole = "726377726931632169"
const category = "745750689698807900"
const ccategory = "1013954806148247622"
const guild = "726163486748704829"
const bugchannel = "980824829869563954"

module.exports = {
    
    async sendsupportmessage(client, channelid) {
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('supportopenbug')
					.setLabel('Bug report')
					.setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
					.setCustomId('supportopengeneral')
					.setLabel('General support')
					.setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
					.setCustomId('supportopenreport')
					.setLabel('Report a player')
					.setStyle(ButtonStyle.Primary),
			);
        client.channels.cache.get(channelid).send({content: "Need help? Click on one of these following options!\n\n🐛 Bug report: Report a bug you have found on any of our platforms\n\n📣 General support: Ask for any support within our services\n\n🗃️ Player report: Report a player", components: [row]})
    },

    async slashcommandinit(client) {
        let commands = client.guilds.cache.get(guild).commands
    
        commands?.create({
            name: "report-player",
            description: "Finish off a ticket with this command"
        })
        commands?.create({
            name: "bug-report",
            description: "Finish off a ticket with this command"
        })
    },

    async start(interaction) { 
        if (interaction.isButton()) {
            if (interaction.customId.startsWith("supportclose")) {
                this.closeticket(interaction)
            }
            if (interaction.customId.startsWith("supportopen")) {
                this.openticket(interaction)
            }
            if (interaction.customId.startsWith("supportreopen")) {
                this.supportreopen(interaction)
            }
            if (interaction.customId.startsWith("supportdelete")) {
                this.supportdelete(interaction)
            }
        }
    },

    async supportdelete(interaction) {
        if (!interaction.user.id == "330979731673710592") {
            interaction.reply({content: "You cannot perform this action.", ephemeral: true})
            return;
        }
        if (interaction.customId.startsWith("supportdeletesoft")) {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('supportdeletecom')
                        .setLabel('I\'m sure')
                        .setStyle(ButtonStyle.Danger),
                )
            interaction.reply({content: "Are you sure you want to delete this?", ephemeral: true, components: [row]})
        }
        if (interaction.customId.startsWith("supportdeletecom")) {
            interaction.channel.delete();
        }
    },

    async openticket(interaction) {

        async function initiliaze(tickettype) {
            const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('supportclosesoft|' + interaction.user.id)
					.setLabel('Close ticket')
					.setStyle(ButtonStyle.Danger),
			);
            const embed = new EmbedBuilder().setTitle(tickettype).setDescription(`Please describe your problem in full here then an available staff member will be ready to help!`)
            if (interaction.guild.channels.cache.get(category).children.cache.size == 50) {
                if (!interaction.replied && !interaction.deferred) await interaction.reply({content: "Unfortunately, the max channels has been reached in this category", ephemeral: true})
                return
            }
            let channel = await interaction.guild.channels.create({"type": 0, "name": (interaction.member.nickname == null ? interaction.user.username : interaction.member.nickname) + "-" + interaction.user.discriminator, parent: category})
            
            channel.lockPermissions().then(() => {
                channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });
                channel.send({content: `<@${interaction.user.id}>`,embeds: [embed], components: [row]})
            })
            
            return
        }

        if (interaction.customId.startsWith("supportopenbug")) {
            await initiliaze("Bug report")
            if (!interaction.replied && !interaction.deferred) interaction.deferUpdate()
        }
        if (interaction.customId.startsWith("supportopengeneral")) {
            await initiliaze("General question")
            if (!interaction.replied && !interaction.deferred) interaction.deferUpdate()
        }
        if (interaction.customId.startsWith("supportopenreport")) {
            await initiliaze("Player report")
            if (!interaction.replied && !interaction.deferred) interaction.deferUpdate()
        }
    },

    async supportreopen(interaction) {
        if (interaction.channel.parentId == category) {
            interaction.reply({content: "Ticket already opened", ephemeral: true})
            return
        }

        if (interaction.guild.channels.cache.get(category).children.cache.size == 50) {
            if (!interaction.replied && !interaction.deferred) await interaction.reply({content: "Unfortunately, the max channels has been reached in this category", ephemeral: true})
            return
        }

        
        interaction.channel.setParent(category)
        interaction.channel.lockPermissions().then(() => {
            interaction.channel.permissionOverwrites.edit(interaction.customId.split("|")[1], { ViewChannel: true });
        })

        const embed = new EmbedBuilder().setTitle("🔓 Ticket re-opened").setDescription("The ticket was reopened, the user was added back to the channel.")
        interaction.message.edit({embeds: [interaction.message.embeds[0],embed], components: []})
        
        interaction.deferUpdate()
    },

    async closeticket(interaction) {
        if (interaction.channel.parentId == ccategory) {
            interaction.reply({content: "Ticket already closed", ephemeral: true})
            return
        }
        if (interaction.customId.startsWith("supportclosesoft")) {
            let content = ""
            if (interaction.member.roles.cache.some(role => role.id == supportrole)) {
                content = "Are you sure you want to move and close this ticket?"
            } else {
                content = "Are you sure you want to close this ticket?"
            }
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('supportcloseforce|' + interaction.customId.split("|")[1])
                        .setLabel('I\'m sure')
                        .setStyle(ButtonStyle.Danger),
                )
            interaction.reply({content: content, ephemeral: true, components: [row]})
        } else {
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('supportreopen|' + interaction.customId.split("|")[1]).setLabel('Re-open ticket').setStyle(ButtonStyle.Danger),new ButtonBuilder().setCustomId('supportdeletesoft').setLabel('Delete ticket').setStyle(ButtonStyle.Danger),)

            const embed = new EmbedBuilder().setTitle("🔒 Ticket closed").setDescription("This ticket is closed, re-open the ticket below")
            
            if (interaction.guild.channels.cache.get(ccategory).children.cache.size == 50) {
                if (!interaction.replied && !interaction.deferred) await interaction.reply({content: "Unfortunately, the max channels has been reached in this category", ephemeral: true})
                return
            }
            interaction.channel.setParent(ccategory)
            interaction.channel.lockPermissions();
            interaction.channel.send({embeds: [embed], components: [row]})
            interaction.deferUpdate()
        }
    },
    
    async bugreport(interaction) {
        if (!interaction.member.roles.cache.some(role => role.id == supportrole)) {
            interaction.reply({content: "You cannot do this", ephemeral: true})
            return
        }
        const embed = new EmbedBuilder().setTitle("Bug report").setDescription("Thanks for dealing with the ticket, now can you just help us with abit more info about the ticket?")
        const row = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId("bugreporthelper").setPlaceholder('Please select all that apply').setMinValues(1).setMaxValues(3).addOptions([{label: 'Re-Creation',description: 'Did the user provide ato re-create the bug?',value: 'rec'},{label: 'Images/File',description: 'The user provided images/Files.',value: 'files'},{label: 'Bot related',description: 'The issue was with the Discord Bot',value: 'bot'},{label: 'Website related',description: 'The issue was with the Website',value: 'website'},{label: 'Roblox related',description: 'The issue was with the Roblox side',value: 'roblox'},]))
        interaction.reply({embeds: [embed], components: [row]})
    },

    async playerreport(interaction) {
        
    },

    async menuhandler(interaction) {
        if (!interaction.customId == "bugreporthelper") return
        if ((interaction.values.includes("bot") && interaction.values.includes("website")) || (interaction.values.includes("roblox") && interaction.values.includes("website")) || (interaction.values.includes("bot") && interaction.values.includes("roblox"))) {
            interaction.reply({"content": "Can't select more than one platform", ephemeral: true})
            return
        }

        const modal = new ModalBuilder().setCustomId("bugmodal&" + interaction.values.join("|")).setTitle('Bug report');
      
        var firstActionRow = new ActionRowBuilder()
        var ifirstActionRow = new ActionRowBuilder()
        var ofavoriteColorInput = new TextInputBuilder().setCustomId('title').setLabel(`Bug Title`).setMaxLength(50).setMinLength(1).setStyle(TextInputStyle.Short);
        var favoriteColorInput = new TextInputBuilder().setCustomId('des').setLabel(`Give a small but detailed description.`).setMaxLength(500).setMinLength(1).setPlaceholder("Description").setStyle(TextInputStyle.Paragraph);
                

        ifirstActionRow.addComponents([favoriteColorInput]);
        firstActionRow.addComponents([ofavoriteColorInput]);
            

        modal.addComponents([firstActionRow, ifirstActionRow]);
            
        
        await interaction.showModal(modal);
    },

    async modalhandler(client, interaction) {
        const embed = new EmbedBuilder()    
        .setTitle(`New bug: ${interaction.fields.getTextInputValue("title")}`)
        .setDescription(`${interaction.fields.getTextInputValue("des")}`)
        .addFields([{"name": "Ticket:", "value": `<#${interaction.channel.id}>`, "inline": true}, {"name": "Files used?", "value": (interaction.customId.includes("files") ? "Yes" : "No"), "inline": true}, {"name": "User provided a re-creation guide?", "value": (interaction.customId.includes("rec") ? "Yes" : "No"), "inline": true}, {"name": "Platform", "value": (interaction.customId.includes("roblox") ? "Roblox" : (interaction.customId.includes("website") ? "Website" : (interaction.customId.includes("bot") ? "Discord Bot" : "Unknown"))), "inline": true}])
        client.channels.cache.get(bugchannel).send({"embeds": [embed]})
        interaction.deferUpdate()
    }


}