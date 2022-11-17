/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector} from "@nestjs/core";
import { AllowedRoles } from "./role.decorator";
import { JwtService } from "src/jwt/jwt.service";
import { UsersService } from "src/users/users.service";

/*#️⃣5.9 AuthGuard
  1. 설치: npx nest g mo auth > 📃https://docs.nestjs.com/guards
  2. 의미: request를 다음 단계로 진행할지 말지 결정 
  3. ⭐CanActivate
   > return true > request를 진행
   > return false > request를 멈추게 한다 

  4. 📃interface CanActivate - 🚨graphql의 contenxt가 아님❗
     * 🔵@param context Current execution context. Provides access to details about
     * the current request pipeline. (즉 request의 context )
     *
     * 🔵@returns Value indicating whether or not the current request is allowed to
     * proceed.
     > Q. context? 가 뭔지 궁금 > console.log(context)

  5. [users.resolver.ts] ⭐UseGuards 활성화 확인
    @Query(returns => User)
      @UseGuards(AuthGuard)
      me( ) {
        
      }

  6. [graphql]
    {
      me {
        email             >>         "message": "Forbidden resource",
      }
    }

  7. true를 리턴하면 request를 다음 단게로 진행시킨다 
    @Injectable()
    export class AuthGuard implements CanActivate{
      canActivate(context: ExecutionContext) {
        console.log(context)
        return true; 
      }
    }

  8.🔴문제는 context가 http로 되어있음 vs graphql context과 다름 
      >이유: GraphQL은 들어오는 요청에서 다른 유형의 데이터를 수신/ Guard와 인터셉터는 모두에서 수신하는 실행 컨텍스트 
    🔵Guard와 인터셉터는 일반 EXecutionContext를 >> GqlExcutionContext로 변환해야 함 
  

    🔹Guards는 ExecutionContext 인스턴스에 액세스할 수 있으므로 다음에 실행될 항목을 정확히 알고 있습니다.
      토큰을 추출 및 검증하고 추출된 정보를 사용하여 요청을 진행할 수 있는지 여부를 결정합니다.
    🔹authentication: 토큰의 유효성 확인, 누가 자원을 요청하는지 확인하는 과정 
    🔹authorization: 유저가 어떤 일을 하기 전에 그 일을 할 수 있는 권한이 있는지 확인
  
  
    9 어떻게 authorization 할지 ?
     > 의미: authorization은 user가 어떤 일을 하기전에 permission(권한)을 가지고 있는지 확인하는 과정
     > 예시: Owner만 레스토랑을 만들 수 있다

  */
/*#️⃣10.6 Roles Recap
  1. console.log(roles) //undefined 나오면 public 이라는 의미
  2. me는 authGuard가 작동한다는 것이고 role에 관계없이 자신의 profile을 볼 수있다 
  */
 /*#️⃣12.2 Subscription Authentication part one
    request headers > jwt Middleware, user를 찾아서, user(찾은유저) = req['user']에 넣음  
     > context: ({ req }) => ({ user: req[ 'user' ]})  "context.user"
    1. ❗누가(우리 Guard 또는 ) GqlExcution에 contenxt를 제공하고 있을까 ?
        
   #️⃣12.3 Subscription Authentication part Two
   1. jwtMiddleware 역할 > private readonly jwtService: JwtService(설정)
    
 */
 /*#️⃣13.2 Subscription Authentication part One
    1. ⭐guard가 '웹 소켓'과 'HTTP'를 위해서 호출 되었다⭐
    2. const gqlContext = GqlExecutionContext.create(context).getContext();
       ⚡console.log(gqlContext.token)
       > headers:{ 'x-jwt': "ey~" }
    3. [app.modul.ts]
      GraphQLModule.forRoot({
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: (✅connectionParams) => {        
            }
          }
        }      
      ✅context: ({ req, connection }) => ({ token: req.headers['x-jwt'] }),
      })

    📄✅connection.context will be equal to what was returned by the "onConnect" callback

     Q. 누가 guard에 GqlExecutionContext에 context를 제공하지 ? 
    🅰GraphQLModule.forRoot 안에 있는 context가 guard에 context를 제공 한다 

    4. [app.module.ts] 
       🚀context({req, connection }) => { ⚡return "Test!" }
       [auth.guard.ts]
        const gqlContext = GqlExecutionContext.create(🚀context).getContext();
         
 */
     
@Injectable()
export class AuthGuard implements CanActivate{
  
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler()
    );  
    
    if(!roles) {
      return true
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    //console.log(gqlContext.token)
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString()) //decoded: { id: 13, iat: 1667663508 } 
      if( typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.usersService.findById(decoded['id']); 

        if(!user) {
          return false;
        }
//⭐guard가 'Decorator(@AuthUser)' 보다 먼저 호출되기 때문 >(찾은)user를 graphQL Context에 ['user']에 추가함  
        gqlContext['user'] = user;  
        if(roles.includes("Any")) {
          return true;
        }
        return roles.includes(user.role)
        } else {
          return false;
        }
      } else {
        return false;
      }

  }
}
