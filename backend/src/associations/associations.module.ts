import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { AssociationsController } from './associations.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [AssociationsController],
  providers: [AssociationsService],
})
export class AssociationsModule {}
