import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { VideoController } from './controllers/video.controller';
import { UserController } from './controllers/user.controller';
import { VideoService } from './services/video.service';
import { UserService } from './services/user.service';
import { Video, VideoSchema } from './models/video.schema';
import { User, UserSchema } from './models/user.schema';
import { IsAuthenticated } from './app.middleware';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/videostreamapp'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const ext = file.mimetype.split('/')[1];
          cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
        },
      })
    }),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController, VideoController, UserController],
  providers: [AppService, VideoService, UserService],
})

export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthenticated)
      .exclude({ path: 'api/v1/video/:id', method: RequestMethod.GET })
      .forRoutes(VideoController);
  }

}
