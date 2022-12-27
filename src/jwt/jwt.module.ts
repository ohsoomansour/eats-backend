/* eslint-disable prettier/prettier */
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';
/*#️⃣5.2 JWT and Modules   
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
  3. Modules 만들기 > 🚧npx nest g mo jwt
   3.1 static 모듈: [app.module.ts] @Module({ imports: [UersModule] }) > 설정이 안되어 있는 모듈
             
   3.2 GraphQLModule.forRoot({설정})는 'Dynamic(동적인)Module'이다 > "설정이 되어있음 " 
   3.3  @Module({ imports: [JwtMdule] }) > "jwt가 우리 설정을 받아들일 수 있게 바꿔준다 "

#️⃣5.3 JWT Module part One 
  ✅컨셉: 동적모듈을 정적모듈로 반환
  1. ⭐Dynamic Module은 또 다른 모듈을 반환한다 
   class jwtModule {
    static forRoot(): DynamicModule { "정적 메서드는 메서드를 프로퍼티 형태로 직접 할당하는 것과 동일한 일" === class의 속한 함수를 구현
      return {
        module:JwtModule
      }
    }
  }  
  2. module이 service를 export 한다 > 🚧npx nest g s jwt
    [users.service.ts]
    @Injectable()
    export class UsersService {
      constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
      ✅private readonly jwtService: JwtService  "nestjs는 JwtService 클래스 타입만 보고 import에서 알아서 찾아줌"
      ){}
      }  
*/
/*#️⃣5.4 JWT Module part Two
1.  forRoot(options: JwtModuleOptions) 에서 option을 어떻게 JwtService로 내보내나 ?
   > provider object를 사용하면 된다 > ctr + providers 클릭

2. providers:[JwtService] JwtService는 함축된 것 (shorcut)
    원래는 providers:[{
            privide: JwtService,  🔹"Injection token"
            useClass:JwtService   🔹"Type (class name) of provider"
          }]
3.providers:[
        {
          provide:'Banana',  "provider는 Banana이고"
          useValue:options   "value로 options를 provide 해주는 거다 "
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
