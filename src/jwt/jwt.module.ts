/* eslint-disable prettier/prettier */
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';
/*#๏ธโฃ5.2 JWT and Modules   
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
  3. Modules ๋ง๋ค๊ธฐ > ๐งnpx nest g mo jwt
   3.1 static ๋ชจ๋: [app.module.ts] @Module({ imports: [UersModule] }) > ์ค์ ์ด ์๋์ด ์๋ ๋ชจ๋
             
   3.2 GraphQLModule.forRoot({์ค์ })๋ 'Dynamic(๋์ ์ธ)Module'์ด๋ค > "์ค์ ์ด ๋์ด์์ " 
   3.3  @Module({ imports: [JwtMdule] }) > "jwt๊ฐ ์ฐ๋ฆฌ ์ค์ ์ ๋ฐ์๋ค์ผ ์ ์๊ฒ ๋ฐ๊ฟ์ค๋ค "

#๏ธโฃ5.3 JWT Module part One 
  โ์ปจ์: ๋์ ๋ชจ๋์ ์ ์ ๋ชจ๋๋ก ๋ฐํ
  1. โญDynamic Module์ ๋ ๋ค๋ฅธ ๋ชจ๋์ ๋ฐํํ๋ค 
   class jwtModule {
    static forRoot(): DynamicModule { "์ ์  ๋ฉ์๋๋ ๋ฉ์๋๋ฅผ ํ๋กํผํฐ ํํ๋ก ์ง์  ํ ๋นํ๋ ๊ฒ๊ณผ ๋์ผํ ์ผ" === class์ ์ํ ํจ์๋ฅผ ๊ตฌํ
      return {
        module:JwtModule
      }
    }
  }  
  2. module์ด service๋ฅผ export ํ๋ค > ๐งnpx nest g s jwt
    [users.service.ts]
    @Injectable()
    export class UsersService {
      constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
      โprivate readonly jwtService: JwtService  "nestjs๋ JwtService ํด๋์ค ํ์๋ง ๋ณด๊ณ  import์์ ์์์ ์ฐพ์์ค"
      ){}
      }  
*/
/*#๏ธโฃ5.4 JWT Module part Two
1.  forRoot(options: JwtModuleOptions) ์์ option์ ์ด๋ป๊ฒ JwtService๋ก ๋ด๋ณด๋ด๋ ?
   > provider object๋ฅผ ์ฌ์ฉํ๋ฉด ๋๋ค > ctr + providers ํด๋ฆญ

2. providers:[JwtService] JwtService๋ ํจ์ถ๋ ๊ฒ (shorcut)
    ์๋๋ providers:[{
            privide: JwtService,  ๐น"Injection token"
            useClass:JwtService   ๐น"Type (class name) of provider"
          }]
3.providers:[
        {
          provide:'Banana',  "provider๋ Banana์ด๊ณ "
          useValue:options   "value๋ก options๋ฅผ provide ํด์ฃผ๋ ๊ฑฐ๋ค "
        }
      ],
4. [jwt.constatns.ts]
   export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';            
*/
@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module:JwtModule,
      exports:[JwtService],
      providers:[
        {
          provide:CONFIG_OPTIONS,
          useValue:options
        },
        
        JwtService
      ],
      
    }
  }
}
