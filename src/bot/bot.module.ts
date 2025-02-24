import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';
import { ConfigModule } from '@nestjs/config';
import { JoinMeCommand } from './commands/joinMe.command';
import { ScramCommand } from './commands/scram.command';
import { GetInitCommand } from './commands/getInit.command';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    SocketModule,
    ConfigModule.forRoot(),
    DiscordModule.forRootAsync({
      useFactory: () => ({
        token: process.env.TOKEN,
        discordClientOptions: {
          intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds],
        },
      }),
    }),
  ],
  providers: [JoinMeCommand, ScramCommand, GetInitCommand],
})
export class BotModule {}
