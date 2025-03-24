import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MappingsModule } from './mappings/mappings.module';
import { ProgramsModule } from './programs/programs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo:27017/med-indications'),
    AuthModule,
    UsersModule,
    MappingsModule,
    ProgramsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
