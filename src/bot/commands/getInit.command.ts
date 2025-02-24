import { Handler } from '@discord-nestjs/core';
import { Command } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { CommandInteraction, GuildMember, MessageFlags } from 'discord.js';

@Command({
  name: 'getinit',
  description: 'Get the init command',
})
@Injectable()
export class GetInitCommand {
  @Handler()
  async onMessageCreate(interaction: CommandInteraction) {
    const member = interaction.member as GuildMember;

    const initData = {
      guildId: interaction.guildId,
      channelId: member.voice.channelId,
      userId: interaction.user.id,
    };
    
    await interaction.reply({
      content: Object.keys(initData)
        .map(
          (key) =>
            `**${key.charAt(0).toUpperCase() + key.slice(1)}**: ${
              initData[key]
            }`,
        )
        .join('\n'),
      flags: [MessageFlags.Ephemeral, MessageFlags.SuppressNotifications],
    });
  }
}
