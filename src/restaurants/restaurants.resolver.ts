/* eslint-disable prettier/prettier */
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.docator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditrestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dtos/my-restaurant.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import {  RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
/*#️⃣1.1 Our First Resolver
  1.Query는 첫 번재 argument로 function이 필요하다
  #️⃣1.2 ObjectType
    *npm run start:dev
  1. Restaurant의 resolver가 되었다 
  #️⃣1.3 Arguments
  1.@Resolver()
    export class RestaurantResolver {
      @Query(returns => [Restaurant])  ⭐GraphQL방법
      myRestaurant(@Args('veganOnly') veganOnly: string): Restaurant[] {   ⭐Typescript 방법/그라운드:GraphQL
        return [];
      };
    };
  2.@Object type
  - 가장 기본적인 GraphQL 스키마 구성요소는 나의 서비스에서 가져올 수있는 객체와 그 객체가 가지고 있는 필드를 보여주는 object type
  - 예시) type Character { name: String! appearsin: [Episode!]! }
      > Character은 GraphQL object Type이다 = 몇 개의 필드를 가진 타입이라는 뜻 
  3. argument도 등록 
  - 뭔가 필요하다면, 필요한 것을 요청해야한다 
   >⭐@Args('veganOnly') veganOnly: boolean
   > 그라운드

  #️⃣1.4 InputType and ArgumentTypes
    @Mutation Type  
  1.🔹Post,Delete,PUT request 의 기능은 Mutation type에 넣어줄거다
   - 설명: user가 보낸 data로 mutate(변형)하는 동작들을 모두 넣는다 
     예시1) user가 data를 보내게 해서 그걸 backend에 업로드 하고 싶거나 'mutate' 한다면 그건 mutation이다
     예시2) database를 수정하고 cache를 지우고 logout 기능을 작동하게 만들고 싶다면 
  
  ⭐Query, Mutation Type
   - 의미: 어떠한 로직이 있는게 아니라, type 을 선언해주는 것
    🔹Get요청시, @Query()는 url에 있는 쿼리값을 갖고 온다 
   - [controller.ts]에서 사용해야됨 
     https://melvingeorge.me/blog/get-all-query-parameters-in-get-request-nestjs  

  ⭐resolver
   - 의미: 어떠한 타입이 선언되었으니, 해당 선언에 로직을 만들어 주는 곳 
   - 스키마에서 지정한것과 동일한 형태의 데이터를 반환 
    controller  = Resolver 
    @Resolver 리졸버 데코레이터를 사용해서 resolver 클래스를 만든다 
    > 특정 기능에 대한 api들이 모여있는 그룹
    > resolver 클래스 안에 관련된 query와 mutation들이 들어있다 
    > @Query를 통해 클라이언트에서 보낸 query를 받아오게 된다 이것을 'query parameter' 라고 부른다
   
*/
/*#️⃣3.2 Injecting The Repository
1. RestaurantService를 🚀 > RestaurantResolver에 inject 한다
  🚨Please open an issue, share your code and upload screenshots.
*/
/*#️⃣10.4 Roles part One ~ Two ~ Recap
    1.⭐metadata를 사용 > @SetMetaData
     - 해석: class 혹은 function에 넣은 'key를 이용해 metadata를 assign'하는 decorator
     - 키 포인트: 우리가 거의 모든 resolver에 metadata를 설정하고 싶다! 

   
  mutation{
  createRestaurant(input: {
    name:"BBQ House I",
    address:"123 Ulsan-ro",
    coverImage:"https:///",
    categoryName: "Korean bbq"
  }) {
    ok
    error
  }
  
}
mutation{
  createAccount(input:{
    email:"ceooma@gmail.com",
    password:"284823"
    role:Owner
  }){
  	ok
    error
  }
}

*/
/*#️⃣10.12 Categories part One
  1. 🔷@ResolveField는 매 request마다 계산된 field를 만들어주고 + db저장되는 field가 아님 
   예시)
    @ResolveField(type => Number )
    resaurantCount():Number { ⭐dynamic field를 만들었고 
      return 80;
    }
*/


@Resolver(of => Restaurant)
export class RestaurantResolver { 
  constructor(private readonly restaurantService: RestaurantService) {}
  
  @Mutation(returns => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
  @AuthUser() authUser: User,
  @Args('input') createRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
  
   return await this.restaurantService.createRestaurant(
    authUser,
    createRestaurantInput
     )
  }
  @Query(returns => MyRestaurantsOutput)
  @Role(['Owner'])
  myRestaurants(
    @AuthUser() owner:User,
  ): Promise<MyRestaurantsOutput>{
    return this.restaurantService.myRestaurants(owner)
  }

  @Query(returns => MyRestaurantOutput)
  @Role(['Owner'])
  myRestaurant(
    @AuthUser() owner: User,
    @Args('input') myRestaurantInput: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
    return this.restaurantService.myRestaurant(owner, myRestaurantInput);
  }


  @Mutation(returns => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner:User,
    @Args('input') editRestaurantInput:EditrestaurantInput
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput)
  }
    
  @Mutation(returns => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner:User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput>{
     return this.restaurantService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
     )
  };
  @Query(returns => RestaurantsOutput)
  restaurants(@Args('input') restaurantsInput: RestaurantsInput 
  ) : Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput)
  };

  @Query(returns => RestaurantOutput)
  restaurant(
    @Args('input') restaurantInput: RestaurantInput
  ):Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput)
  }
  @Query(returns => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
};

//❗카테고리 2가지 : service, Resolver 프로바이더 수가 적어 별도 생성X
@Resolver(of => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService ){}

  //promise를 return하면 브라우저가 알아서 결과가 나올 때까지 기다림 === count메서드의 반환 값은 Promise<number>의 resolve를 기다림
  @ResolveField(type => Number ) 
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurant(category)
  }

  @Query(type => AllCategoriesOutput)
  allCategories():Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  @Query(type => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput 
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryByslug(categoryInput)
  }
  
}

@Resolver(of => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(type => CreateDishOutput)
  @Role(["Owner"])
  createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(owner, createDishInput)
  }

  @Mutation(type => EditDishOutput)
  @Role(["Owner"])
  editDish(
    @AuthUser() owner: User,
    @Args('input') editDishInput: EditDishInput
  ): Promise<EditDishOutput> {
    return this.restaurantService.editDish(owner, editDishInput)
  }

  @Mutation(type => DeleteDishOutput)
  @Role(["Owner"])
  deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDish(owner, deleteDishInput)
  }
}