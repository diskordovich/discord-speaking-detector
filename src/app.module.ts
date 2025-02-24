import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { SocketModule } from './socket/socket.module';
@Module({
  imports: [
    ConfigModule.forRoot(), 
    BotModule, 
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
