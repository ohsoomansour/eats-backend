/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './common.constant';
/*#️⃣13.0 Subscriptions part One - Graphql Subscription ~ #️⃣13.12 takeOrder 
    1.[GraphQL] subscripttions은 resolver에서 '변경사항'이나 '업데이트'를 수신 할 수 있게 해준다

    2. [orders.resolver.ts] 📄npmjs.com/package/graphql-subscriptions
      @Subscription(returns => String) ⭐"몇 가지 규칙이 있는데 그 규칙은 우리가 뭘 return 하는지에 따라 정해짐"
      hotPotatos() {
        return pusub.asyncIterator(triggers: ⭐우리가 기다리는 이벤트) "이벤트를 듣고 싶으면 이 Subscription쓰면 된다"
      }

     3. PubSub은 publish and subscribe를 말한다  
        subscription{
          hotPotatos
        }
     4. {
          "error": "Could not connect to websocket endpoint ✅ws://localhost:3000/graphql.
          Please check if the endpoint url is correct."
        }
        🔹ws: 프로토콜, 이것은 Real Time을 처리하는 'Web Socket'을 말한다 
         ✅Web Socket을 활성화 해야한다 
         GraphQLModule.forRoot({
         ✅installSubscriptionHandlers:true, ⭐서버가 웹 소켓 기능을 가지게 된다 
         }),
         🔴웹 소켓에는 'request'가 없다
         🔵웹 소켓에는 'conneection'이라는 것이 있다 
     5. connection은 'context'와 같이 온다  vs  request는 x-jwt header가 있다 
     
     6. Listening 
        [playground 1]
        subscription{
          readyPotato() 
        }
        [orders.resolver.ts]
        @Subscription(returns => String)
        @Role(['Any'])
      ⭐readyPotato(@AuthUser() user: User) {
          console.log(user);
          return pubsub.asyncIterator(✅'hotPotatos'); 🔵이벤트를 듣고(Listening ...)
        }
      
       [playground 2] 
         mutation {
          potatoReady
         }
       [orders.resolver.ts]  
        @Mutation(returns => Boolean)
        potatoReady() {
          pubsub.publish(✅'hotPotatos', {
          ⭐readyPotato: 'YOur potato is ready. love you.',  🔵payload에 'readyPoato'가 같아야함
          });
          return true;
        }
        }
      7. 🔷Pubsub을 전역으로 사용하는 방법  
        [common.modul.ts]
          import { Global, Module } from '@nestjs/common';
          import { PubSub } from 'graphql-subscriptions';
          import { PUB_SUB } from './common.constant';
          const pubsub  = new Pubsub();✅
          @Global()✅
          @Module({
            providers: [
              {
                provide: PUB_SUB,✅
                useValue: pubsub ✅
              }
            ],
            exports: [PUB_SUB]✅
          })
        
        [order.resolver.ts]
          @Inject(PUB_SUB) private readonly pubSub: PubSub,

      8.📄npmjs.com/package/graphql-subscriptions
         > 한 개의 서버에서만 가능 하다 

     9. filter:(payload, variables, context) => {}        
      ⭐ variable는 listening을 시작하기 전에 subscripion에 준 variables 
      ⭐ 'context' === [auth.guard.ts] 의 const 'gqlContext' = GqlExecutionContext.create(context).getContext(); 
          
       */  


const pubsub = new PubSub();
@Global()
@Module({
  providers:[
    {
      provide: PUB_SUB,
      useValue: pubsub
    }
  ],
  exports: [PUB_SUB]
})
export class CommonModule {


}
