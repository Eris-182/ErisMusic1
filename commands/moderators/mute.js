const { MessageEmbed } = require('discord.js')
const ms = require("ms")

module.exports = {
    name: "mute",
    cooldown: 1000,
    description: "Mute user",
    async execute(client, message, args) {
        const embed = new MessageEmbed()
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(embed.setDescription('<a:error:854851816289075260> | You do not have permissions to use this command'))
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!Member) return message.channel.send(embed.setDescription('<a:error:854851816289075260> | Member is not found.'))
        const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted')
        if(!role) {
            try {
                message.channel.send(embed.setDescription('<a:error:854851816289075260> | Muted role is not found, attempting to create muted role.'))

                let muterole = await message.guild.roles.create({
                    data : {
                        name : 'muted',
                        permissions: []
                    }
                });
                message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                    await channel.createOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                });
                message.channel.send(embed.setDescription('<a:success:854851799063461940>  | Muted role has sucessfully been created.'))
            } catch (error) {
                console.log(error)
            }
        };
        let role2 = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted')
        if(Member.roles.cache.has(role2.id)) return message.channel.send(embed.setDescription(`<a:success:854851799063461940>  | \`${Member.displayName}\` has already been muted.`))
        await Member.roles.add(role2)
        message.channel.send(embed.setDescription(`<a:success:854851799063461940>  | \`${Member.displayName}\` is now muted.`))
    }
}