/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
/*#️⃣5.10 AuthUser Decorator
1. login안 되어있다면 request를 멈춤
   login되어있다면 request를 진행시킨다 

2.⭐resolver에서 request를 보내고 있는 것이 무엇인지 알아야 된다  누가 ? 
  @Query(returns => User)
  @UseGuards(AuthGuard)

  me( ) {}
3. ⭐createParamDecorator는 factory function이 필요하다

*/


//✅ canActivate의 context === createParamDecorator의 context가 같다, 아래의 Author은 Custom Decorator이다
export const AuthUser = createParamDecorator (
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user  = gqlContext['user']
    return user; 
    
  },


)
