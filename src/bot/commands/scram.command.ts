import { Handler } from "@discord-nestjs/core";
import { Command } from "@discord-nestjs/core";
import { getVoiceConnection } from "@discordjs/voice";
import { Injectable } from "@nestjs/common";
import { CommandInteraction, GuildMember } from "discord.js";


@Command({
    name: 'scram',
    description: 'Tell the Kobbot to scram from the voice channel',
})
@Injectable()
export class ScramCommand {
    @Handler()
    async onMessageCreate(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        
        const connection = getVoiceConnection(member.voice.channel.guild.id);

        if(!connection) {
            return interaction.reply('I am not in a voice channel');
        }

        connection.destroy();
        await interaction.reply('Scram');
    }
}