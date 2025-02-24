import { Command, Handler } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { CommandInteraction, GuildMember, MessageFlags } from 'discord.js';
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { SocketService } from 'src/socket/socket.service';

@Command({
  name: 'joinme',
  description: 'Join the voice channel',
})
@Injectable()
export class JoinMeCommand {
  constructor(private readonly socketService: SocketService) {}

  @Handler()
  async onMessageCreate(interaction: CommandInteraction) {
    try {
      
      const member = interaction.member as GuildMember;
      if(!member.voice.channel) {
        return interaction.reply({content: 'You are not in a voice channel', flags: [MessageFlags.Ephemeral, MessageFlags.SuppressNotifications]});
      }

      const connection = await joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: member.voice.channel.guild.id,
        adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 5e3);
      } catch (error) {
        connection.destroy();
        return interaction.reply({content: 'Failed to join voice channel', flags: [MessageFlags.Ephemeral, MessageFlags.SuppressNotifications]});
      }

      connection.on('error', (error) => {
        console.error(error);
      });

      connection.receiver.speaking.on('start', (userId) => {
        const sockets = this.socketService.connectionList.get(member.voice.channel.id);
        if(sockets) {
          sockets.forEach(socket => {
            socket.emit('speaking', userId);
          });
        }
      });

      connection.receiver.speaking.on('end', (userId) => {
        const sockets = this.socketService.connectionList.get(member.voice.channel.id);
        if(sockets) {
          sockets.forEach(socket => {
            socket.emit('shat-up', userId);
          });
        }
      });

      await interaction.reply({content: 'Joined voice channel', flags: [MessageFlags.Ephemeral, MessageFlags.SuppressNotifications]});  
    } catch (error) {
      console.error(error);
      await interaction.reply({content: 'Error joining voice channel', flags: [MessageFlags.Ephemeral, MessageFlags.SuppressNotifications]});
    }
  }
}
