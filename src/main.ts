import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtMiddleware } from './jwt/jwt.middleware';

/*#️⃣1.0 Appllo Server Setup
  1. const app = await NestFactory.create(AppModule);
   - 해석: NesFactory가 AppModule로 부터 애플리케이션을 생성 
     > 그래서 모든 것들은 결국 AppModule로 import 될 거다 
     > AppModule은 우리의 📁'DB', GraphQL, 유저등등을 가져온다 
     > 정리: AppModule에다가 GraphQL 모듈을 추가하여야 한다는 말 
*/
/*#️⃣5.6 Middlewares in NestJS
1. app.use(jwtMiddleware); "어플리케이션 여러 곳에서 사용된다

  #️⃣app.useGlobalPipes 이해
     📄https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
     📄.com/pipes#global-scoped-pipes
   🔹Global pipes are used across the whole application,for every controller and every route handler.
   🔹제네릭 타입: typescript에서 <T> 
     - 예시) ⚡any타입을 반환⚡ 
             function identity(args: any):any {   
               return arg;
             }

             ⚡함수를 호출하는 시점의 인자로 넣은 타입의 결정⚡  
             function identity<T>(arg: T): T {  
               return arg;
             }   
              */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //app.use(JwtMiddleware);
  await app.listen(process.env.PORT || 4000);
  //console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
