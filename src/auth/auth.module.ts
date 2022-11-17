import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/uers.module';
import { AuthGuard } from './auth.guard';
/*#️⃣5.9 AuthGuard
  1. 설치: npx nest g mo auth
  #️⃣10.5 Roles and Two
  [앱 전역에서 AuthGuard가 작동하도록 ]
  1. APP_GUARD를 앱 모든 곳에서 사용하고 싶다면 그냥 APP_GUARD를 provide하면 된다 
   ⭐@Module({
        providers: [
          {
            provide: APP_GUARD,
            useClass: AuthGuard,
          },
        ],
      })
  2. [app.module] 에서 import AuthModule 
  3. 로그인을 해야 AuthGuard가 작동함 (유저가 누구인지 알기 때문)
     그러나 global 하게 만든다면 createAccount가 작동을 하지 않음 
*/

@Module({
  imports: [UsersModule], //Repsitory를 가져 올 수 있다
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
