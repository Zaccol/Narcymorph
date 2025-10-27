import { Module } from '@nestjs/common';
import { PersonalityService } from './personality.service';
import { PersonalityController } from './personality.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [PersonalityController],
  providers: [PersonalityService],
  exports: [PersonalityService],
})
export class PersonalityModule {}
