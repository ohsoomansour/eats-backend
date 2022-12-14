/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interface';
import *as jwt from "jsonwebtoken";
import { CONFIG_OPTIONS } from 'src/common/common.constant';

/*  #๏ธโฃ5.1 Generation JWT(Json web token) 
  1. ๐npmjs.com/package/jsonwebtoken 
    > npm i jsonwebtoken ๐จ"TypeScriptํ์ผ์ด ์์"
    > npm i @types/jsonwebtoken --only-dev
    > import * as jwt from 'jsonwebtoken';

  2. ๐var privateKey = fs.readFileSync('private.key');
     ๐var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'}

     - ํด์1: ์ฐ๋ฆฌ๊ฐ ์ํ๋ ๋ฐ์ดํฐ๋ฅผ 'token'์ ๋ฃ์ด์ฃผ๊ณ  
      > ์ฌ์ฉ์๋ ์๊ธฐ token ์์ ๋ญ๊ฐ ๋ค์๋์ง ๋ณผ ์ ์๋ค
      > โ{foo: 'bar'} ๋ณด๊ณ  ์์ ์ token์ ๋ค์ด์๋ ์ํธ๋ฅผ ํด๋ํ  ์ ์๋ค! ์)ID ์ ๋ณด 
      >๐ซ์ค์ํ ๊ฐ์ธ ์ ๋ณด ๊ธ์ง

     - ํด์2: privateKey >> โกprecess.env์์ ๊ฐ์ ธ์จ๋ค 
      [ app.module์ ์์ ]
      ๐[.env.dev]SECRET_KEY: "token์ ์ง์ ํ๊ธฐ ์ํด ์ฌ์ฉํ๋ privateKey"
        > ์ง์  ์ด์ : 'ํ๋ผ์ด๋น ํค'๋ ์ฌ์ฉ์๊ฐ token์ ์์ ํ๋์ง๋ฅผ ํ์ธํ  ์ ์๋ค! > #๏ธโฃ5.2 ํ์ธ! 
        > ๐randomkeygen.com: โCodeIgniter Encryption Keys - Can be used for any other 256-bit key requirement.
          token์ ๋ง๋ค์ด ์ค ๋, ์ธ์๋ก [.env.dev]SECRET_KEY: HtqpfUVulDBYEZ9eSbnAMSvAcHUzWJJO 
        > ์ฌ์ฉ์๋ค์๊ฒ ์ฝ๊ฐ ์ค ์ฝ๊ฐ์ josn์ ์ง์ ํด ์ค์ผ ํจ
        > ๊ทธ๋์ผ ์ฐ๋ฆฌ๊ฐ ์คjson์ธ์ง ๊ฐ์ง token์ธ์ง 
        > ์ฐ์  token์ด ์๋ํ๊ฒ ๋ง๋ค์ด์ค์ผํจ > token ๋ชจ๋์ ๋ง๋ค์ด์ค๋ค 

      โ[app.module.ts]
         ConfigModule.forRoot({
          isGlobal:true,
          validationSchema: Joi.object({
            โSECRET_KEY: Joi.string().required(),
          })
        })

     - ํด์3: algorithm: 'RS256'

  3. [users.module.ts]
     @Module({
      imports: [TypeOrmModule.forFeature([User]), โConfigService],
      providers: [UsersService, UsersResolver],
    })

  4. dependency injection 
    constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    โprivate readonly config: ConfigService, 
  ){}  
   
  
  5. โญconst token = jwt.sign({id: user.id}, โthis.config.get('SECRET_KEY'))  
     > ๊ฒฐ๊ณผ์ ์ผ๋ก ์ฌ๊ธฐ์ this.config.get('SECRET_KEY')๊ฐ ์๋ํ  ์ ์๋ ๊ฑฐ๋ค
     > dependency injection

  6. ๐ง๋์ const token = jwt.sign({id: user.id}, process.env.SECRET_KEY)
  #๏ธโฃ5.2 JWT and Modules   
  1. [app.module.ts] > โญimports: [ ConfigModule.forRoot({isGlobal:true, ๐น์ฌ๋ฌ ์ต์๋ค ์ค์ }) ]  > configService๋ฅผ ๊ฐ์ง ์ ์๋ค!
    > "์ด๋๊ฐ์ ์กด์ฌํ๊ณ  ์์ + ์์ง ์ ๋ณด๊ฐ ์ด์์๊ณ  ์ด๋๊ฐ ์กด์ฌ "

  2. ๐https://jwt.io/  โญjson web token์ ์ด์ฉํด์ ์ฐ๋ฆฌ๋ง์ด ์ ํจํ ์ธ์ฆ์ ํ  ์ ์๊ฒ ํ๋ ๊ฒโ 
    ๐ท Encoded: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjYzMjE2MDI2fQ._c30ULon2nZXGn8GnjRgVjkTxazXWFT1bvuYRf4lHrI"
    ๐ท Decoded
      ๐น PAYLOAD: DATA { "id": 4, "iat": 1663216026 }
         *payload: post, put, patch๋ ๋ณดํต ๋ฐ์ดํฐ๋ฅผ ๊ฐ์ด ์๋ฒ๋ก ๋ณด๋ธ๋ค. ์ด๋ ์๋ฒ๋ก ๋ณด๋ด๋ data๋ฅผ 'ํ์ด๋ก๋' 
      ๐น VERIFY SGNATURE                 
          HMACSHA256(
            base64UrlEncode(header) + "." +
            base64UrlEncode(payload),
            your-256-bit-secret
          )  

  #๏ธโฃ5.4 JWT Module part Two
  1. JwtModuleOptions >> [jwt.module.ts] module๋ถํฐ >> ๋ฌด์ธ๊ฐ๋ฅผ service๋ก inject ํ  ์ ์๋ค 
     > console.log(options) >> { privateKey: '0bVoAzPLOmS1StzMkDzwjqrl1yTNWQwi' }
  #๏ธโฃ5.5 JWT Module part Three
  1. โ์ฐธ๊ณ :const token = jwt.sign({id: user.id}, this.config.get('SECRET_KEY')) 

  2. โญ2๊ฐ์ง ๋ฐฉ๋ฒ 
    2.1[app.module.ts]์์ ๊ตณ์ด privateKey๋ฅผ ๊ฐ์ ธ ์ฌ ํ์๋ ์๋ค ?
          JwtModule.forRoot({
          ๐privateKey: process.env.PRIVATE_KEY
          })
       [jwt.module.ts]
       JwtModule.forRoot(๐{privatekey: process.env.PRIVATE_KEY }: JwtModuleOptions)   

     2.2 + private readonly config: ConfigService 
        jwt.sign(payload, this.config.get('PRIVATE_KEY')) 

  #๏ธโฃ5.7 JWT Middleware
  1. โญjwt.verify(token, secretOrPublicKey,[options,callback]) "์ฌ๋ฐ๋ฅธ ํ ํฐ์ธ์ง ์๋์ง ํ์ธ"
    
  
    ๐นdependency(์์กด์ฑ): ํด๋์ค ๋๋ ํจ์๊ฐ ์ฌ์ฉํ๊ธฐ ์ํด์ ๋ค๋ฅธ ๊ฐ์ฒด๋ฅผ ์ฐธ์กฐํ๋ ๊ฒ์ ์๋ฏธ      
    ๐นComponent: ํ๋ก๊ทธ๋๋ฐ์ ์์ด ์ฌ์ฌ์ฉ์ด ๊ฐ๋ฅํ ๊ฐ๊ฐ์ ๋๋ฆฝ๋ ๋ชจ๋์ ๋ป   
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
