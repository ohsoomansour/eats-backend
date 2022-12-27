/* eslint-disable prettier/prettier */
/*⭐Entity(독립체): 객체, 서비스 안에서 '저장되어야 하는 어떤 것'
    예) 과목 - entity 수학,영어,언어는 인스턴스 

  ⭐DTO? Data Transfer Object  📃https://resilient-923.tistory.com/356
   - 데이터 전송 객체로, 프로세스 간 데이터를 전달하는 객체
   - 호출을 줄이고 효율적으로 값을 전달, 이를 위해 '데이터'를 모아 한번에 전달하는 방법이 고안 이때 모은 데이터 객체를 DTO라고한다
     Q.왜 DTO를 써야 하나요?
     A.DTO를 사용하지 않으면 호출 횟수가 자연스럽게 많아지고 통신의 횟수 증가로 이어진다 + 비효율적인 로직 
     🔴Client <-DTO-> Controller <-DTO-> Service(비즈니스 처리 로직 Model) <-DTO-> Repository <-Entity-> DB
     🔵Client <-DTO-> Controller(web) - Service(비즈니스 처리 로직 Model) - Repository <-domain(Entity)-> DB
     > 장점1: DTO를 사용하면 '유닛테스트' 할 때 굉장히 쉬워진다. Service레이어에서 유닛테스를 할 때, Entity를 그대로 사용해 버리면
     Service 테스트를 하게된다. 이렇게되면 DB까지 끌어와서 '테스트'를 하게되는데 굉장히 불필요함
     DTO는 그저 계층간 '데이터 교환이 이루어 질 수 있도록 하는 객체'이기 때문에, 특별한 로직을 가지지 않는 순수한 데이터 객체이어야 함
     > 장점2: 유지보수가 쉬워진다  
  ⭐inputType: 기본적으로 'object 통째'로 전달할 수 있도록 해준다 
  🔹mutation {
    createStore(newStoreInfo : {
    name: "",
    isVegan : true,
    address: "",
    ownerName:""
      })
    }

  ⭐ArgsType: "분리된 값들을 GraphQL argument로 전달해 줄 수 있도록 해준다"
  mutation {
  createRestaurant(name: "sooman", address:"울산", isVegan:true, ownerName:"with")
}
 >{
  "data": {
    "createRestaurant": true
    }
  }
*/
/*#️⃣1.5 Validating ArgsTypes - "class와 수많은 decorators의 조합으로 인해 얻을 수 있는 이점들이다 "
  1. dto에 class Validator를 사용 가능 
   > npm i class-validator
   >⭐@IsString, @IsBoolean, @Length(5, 10)
   >⭐[main.ts]에서 validation-pipeline을 만들어야 함
   > [main.ts] app.useGlobalPipes(new ValidationPipe()); + npm install class-transformer
*/

import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'coverImage',
  'address',
  
]) {
  @Field(type => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {
    @Field(type => Int,{nullable:true} )
    restaurantId?: number;

}


