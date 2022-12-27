/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

/*#️⃣5.6 Middlewares in NestJS 
  1. Query를 통해 User가 누구인지 
  2. QUERY VARIABLES HTTP header
    {
      "X-JWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjYzMzAyMzM3fQ.S5SnE-8WKRq_yZt9Bl_5cbmty2zzz5dO0PxjGJqKeK4"
    }
  3. Middlewares - 📄docs.nestjs.com/middleware
    <Client Side>,  🚀HTTP Request🚀 --> 🔷Middleware가 처리해서 넘김🚀 --> <Route Handler>(Request Mapping)

    3.1 의미: 요청을 받고 > 요청 처리 후에 > next() 함수를 호출
    > ⭐middleware에서 토큰을 가져간 다음 > token을 가진 사용자를 찾아준다 
    3.2 request, response object, next()함수를 사용 

  4. [jwt.middleware.ts] 생성
    ⭐implement는 'interface'이다 >> class가 interface처럼 행동해야 한다는 거다 
  
  5. ⭐class로 Middleware 만드는 법
    export class JwtMiddleware implements NestMiddleware {
       use(req: Request, res: Response, next: NextFunction) {
         console.log(req.headers)
         next()
       }
     }
    ⚡아래의 결과가 나옴
    {
      host: 'localhost:3000', 
      connection: 'keep-alive' 
      ✅'x-jwt':eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjYzMzAyMzM3fQ.S5SnE-8WKRq_yZt9Bl_5cbmty2zzz5dO0PxjGJqKe
    }
  
   *미들웨어: Logical Node <-> Middleware <-> Physical Node 양 쪽을 연결하여 데이터를 주고받을 수 있도록 중간에서
  매개 역할을 하는 소프트웨어, 네트워크를 통해서 연결된 여러 개의 컴퓨터에 있는 많은 프로세스들에게 어떤 서비스를 사용할 수 있도록 연결해주는 프로그램

  6.⭐함수로 Middleware 만드는 법 
    export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
      console.log(req.headers)
      next();
    }

  */
/*#️⃣5.7 JWT Middleware
1. middleware에서 토큰을 가져간 다음 > ⭐token을 가진 사용자를 찾아준다
2. 이제 token을 decrypt(암호해독) 할거다
 > token을 'verify' 한다 📃npmjs.com/package/jsonwebtoken 
 > jwt.verify(token, secretOrPublicKey,[options,callback]) "올바른 토큰인지 아닌지 확인"
 > ⭐verify()가 암호해독된 token을 준다 
 
3.jwt.docode(token[,options])
  >  ⭐"해독된 payload를 반환"
 > signature를 verify하지는 않는다
4. typescript는 어떤 header든지 array가 될 수 있다고 생각한다 ->  token: string | string[]
5. dedcoded는 string | Object 
 🔹📃https://docs.nestjs.com/providers#dependency-injection

 6. ⭐findById는 userService에서 제공되는 함수 
    ⭐findOne은 typeorm에서 제공되는 함수 

 User {
  id: 4,
  createdAt: 2022-09-14T09:39:15.979Z,
  updatedAt: 2022-09-14T09:39:15.979Z,
  email: 'ohsoomansour@gmail.com',
  password: '$2b$10$Gj1Ix45AII10nhuqxzVA7ejeajb1u1cJhUeV9XwwypBF50GkqrvzW',
  role: 0
}

*/
  /*#️⃣5.7(마지막 부분)~ #️⃣5.8 Graphql Context
    1.[jwt.middleware.ts]
     ⭐user를 찾아서 user를 request로 보낼거다 === 🔵request 안에 새로운 걸 만들어준 거다!
       
    2. ⭐next()를 호출하면 next handler가 request user를 받는다
    3. Context: 'request context'는 각 request에서 사용이 가능하다
      > context가 함수로 정의되면 매 request마다 호출된다 
      📃https://github.com/apollographql/apollo-server
        new ApolloServer({
            typeDefs,
            resolvers: {
              Query: {
                books: (parent, args, context, info) => {
                  console.log(context.myProperty); // Will be `true`!
                  return books;
                },
              }
            },
            context: async ({ req }) => { 🔵context를 함수로 호출하게 되면 {req} === HTTP request property가 주어진다
              return {
                myProperty: true    🔵Context에 property를 넣으면  >> resolver안에서 사용 할 수 있다 
              };
            },
        })


   4.[app.module.ts]   
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
    ⭐context:({ req }) => ({user: req['user'] })  🔵{user: req['user'] }는 모든 resolver에서 공유할 수 있다 
    }),
   
    5.[user.resolver.ts]
      @Query(returns => User)
        me(@Context() context ) {
          if(!context.user) {
            return;
          } else {
            return context.user;
          }
      }
     
    */ 
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  //dependency Injection
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
    ){}
  async use(req: Request, res: Response, next: NextFunction) {
    if('x-jwt' in req.headers){
      const token = req.headers['x-jwt']; 

      //해독된 token을 준다 
      try {
        const decoded = this.jwtService.verify(token.toString())
        if( typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user, ok } = await this.usersService.findById(decoded['id']); 
        //⭐미들웨어가 원하는 object를 바꿀수있다 >> request object를 모든  resolver에서 사용 할 수 있다 
         if(ok) {
          req['user'] = user;
         }
        }

      } catch (e) {}
    } 
    next();
  }
}
