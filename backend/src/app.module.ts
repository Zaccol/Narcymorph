import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PersonalityModule } from './personality/personality.module';
import { AssociationsModule } from './associations/associations.module';
import { UploadModule } from './upload/upload.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    PersonalityModule,
    AssociationsModule,
    UploadModule,
    ChatModule,
    AiModule,
  ],
})
export class AppModule {}
