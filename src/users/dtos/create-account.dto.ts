/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';


/*#3.5 Mapped Types 📄https://docs.nestjs.com/graphql/mapped-types
1. 
*/


/*#️⃣4.3 Create Account Mutation part One
1. ⭐입력과 출력 > 2개의 DTO를 만듬 
2.#3.5 Mapped Types 📄https://docs.nestjs.com/graphql/mapped-types
> CreateAccountInput을 CreateAccount DTO라고 불러도 무방
3. SELECT * FROM "user"; ⚡
*/

@InputType()
export class CreateAccountInput extends PickType(User, ["email","password","role","address"]) {
  
}

//❗extends의 타입과 일치 시켜줘야함!
@ObjectType()
export class CreateAccountOutput extends CoreOutput{}