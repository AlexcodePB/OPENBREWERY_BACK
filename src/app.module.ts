import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlantillasModule } from './plantillas/plantillas.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, PlantillasModule],
  controllers: [],
  providers: [
    //{
    //provide: APP_GUARD,
    //useClass: AuthGuard,
    //},
  ],
})
export class AppModule {}
