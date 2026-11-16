import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FolderModule } from './modules/folder/folder.module';
import { FileModule } from './modules/file/file.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import appConfig from './config/app.config';
import awsConfig from './config/aws.config';
// import { createObserveModule } from '@nestjs/observe';

// export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        awsConfig
      ]
    }),
    PrismaModule,
    AuthModule,
    FolderModule,
    FileModule,
    UserModule
    // ObserveModule.forRoot({
    //   appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
    //   appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
    //   serviceId: 'tec-doc',
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
