import { Module } from '@nestjs/common';
import { TestContextService } from './context.service';

@Module({
  imports: [],
  providers: [TestContextService],
  exports: [TestContextService],
})
export class TestContextModule {}