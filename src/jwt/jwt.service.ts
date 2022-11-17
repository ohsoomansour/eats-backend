/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';
import *as jwt from "jsonwebtoken";
import { CONFIG_OPTIONS } from 'src/common/common.constant';

/*  #️⃣5.1 Generation JWT(Json web token) 
  1. 📄npmjs.com/package/jsonwebtoken 
    > npm i jsonwebtoken 🚨"TypeScript파일이 없음"
    > npm i @types/jsonwebtoken --only-dev
    > import * as jwt from 'jsonwebtoken';

  2. 📃var privateKey = fs.readFileSync('private.key');
     📃var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'}

     - 해석1: 우리가 원하는 데이터를 'token'에 넣어주고 
      > 사용자는 자기 token 안에 뭐가 들었는지 볼 수 있다
      > ✅{foo: 'bar'} 보고 자신의 token에 들어있는 암호를 해독할 수 있다! 예)ID 정보 
      >🚫중요한 개인 정보 금지

     - 해석2: privateKey >> ⚡precess.env에서 가져온다 
      [ app.module을 수정]
      🔑[.env.dev]SECRET_KEY: "token을 지정하기 위해 사용하는 privateKey"
        > 지정 이유: '프라이빗 키'는 사용자가 token을 수정했는지를 확인할 수 있다! > #️⃣5.2 확인! 
        > 📄randomkeygen.com: ✅CodeIgniter Encryption Keys - Can be used for any other 256-bit key requirement.
          token을 만들어 줄 때, 인수로 [.env.dev]SECRET_KEY: HtqpfUVulDBYEZ9eSbnAMSvAcHUzWJJO 
        > 사용자들에게 약간 줄 약간의 josn을 지정해 줘야 함
        > 그래야 우리가 준json인지 가짜 token인지 
        > 우선 token이 작동하게 만들어줘야함 > token 모듈을 만들어준다 

      ✅[app.module.ts]
         ConfigModule.forRoot({
          isGlobal:true,
          validationSchema: Joi.object({
            ✅SECRET_KEY: Joi.string().required(),
          })
        })

     - 해석3: algorithm: 'RS256'

  3. [users.module.ts]
     @Module({
      imports: [TypeOrmModule.forFeature([User]), ✅ConfigService],
      providers: [UsersService, UsersResolver],
    })

  4. dependency injection 
    constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    ✅private readonly config: ConfigService, 
  ){}  
   
  
  5. ⭐const token = jwt.sign({id: user.id}, ✅this.config.get('SECRET_KEY'))  
     > 결과적으로 여기서 this.config.get('SECRET_KEY')가 작동할 수 있는 거다
     > dependency injection

  6. 🚧대안 const token = jwt.sign({id: user.id}, process.env.SECRET_KEY)
  #️⃣5.2 JWT and Modules   
  1. [app.module.ts] > ⭐imports: [ ConfigModule.forRoot({isGlobal:true, 🔹여러 옵션들 설정}) ]  > configService를 가질 수 있다!
    > "어딘가에 존재하고 있음 + 아직 정보가 살아있고 어딘가 존재 "

  2. 📄https://jwt.io/  ⭐json web token을 이용해서 우리만이 유효한 인증을 할 수 있게 하는 것❗ 
    🔷 Encoded: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjYzMjE2MDI2fQ._c30ULon2nZXGn8GnjRgVjkTxazXWFT1bvuYRf4lHrI"
    🔷 Decoded
      🔹 PAYLOAD: DATA { "id": 4, "iat": 1663216026 }
         *payload: post, put, patch는 보통 데이터를 같이 서버로 보낸다. 이때 서버로 보내는 data를 '페이로드' 
      🔹 VERIFY SGNATURE                 
          HMACSHA256(
            base64UrlEncode(header) + "." +
            base64UrlEncode(payload),
            your-256-bit-secret
          )  

  #️⃣5.4 JWT Module part Two
  1. JwtModuleOptions >> [jwt.module.ts] module부터 >> 무언가를 service로 inject 할 수 있다 
     > console.log(options) >> { privateKey: '0bVoAzPLOmS1StzMkDzwjqrl1yTNWQwi' }
  #️⃣5.5 JWT Module part Three
  1. ✅참고:const token = jwt.sign({id: user.id}, this.config.get('SECRET_KEY')) 

  2. ⭐2가지 방법 
    2.1[app.module.ts]에서 굳이 privateKey를 가져 올 필요는 없다 ?
          JwtModule.forRoot({
          🔑privateKey: process.env.PRIVATE_KEY
          })
       [jwt.module.ts]
       JwtModule.forRoot(🔑{privatekey: process.env.PRIVATE_KEY }: JwtModuleOptions)   

     2.2 + private readonly config: ConfigService 
        jwt.sign(payload, this.config.get('PRIVATE_KEY')) 

  #️⃣5.7 JWT Middleware
  1. ⭐jwt.verify(token, secretOrPublicKey,[options,callback]) "올바른 토큰인지 아닌지 확인"
    
  
    🔹dependency(의존성): 클래스 또는 함수가 사용하기 위해서 다른 객체를 참조하는 것을 의미      
    🔹Component: 프로그래밍에 있어 재사용이 가능한 각각의 독립된 모듈을 뜻   
    */

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,

  ) {}
  sign(userId: number): string {
    return jwt.sign({id: userId }, this.options.privateKey)
  }
  verify(token:string) {
    return jwt.verify(token, this.options.privateKey)
  }
}
