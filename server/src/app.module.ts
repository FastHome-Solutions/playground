import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhoenixModule } from './phoenix/phoenix.module';

@Module({
  imports: [
    PhoenixModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
