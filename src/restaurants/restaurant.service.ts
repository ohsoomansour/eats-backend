/* eslint-disable prettier/prettier */
/* #️⃣4.2 📄https://docs.nestjs.com/techniques/database 
  ⭐RestaurantService 에 실제로 DB에 접근하는 방식을 작성
 1.restaurant.module에서 restaurant repository가 필요하다 
   > TypeORM을 이용해서 Restaurant repository를 import 했다, 여러 entity들이라면 []
   > ⭐imports: [TypeOrmModule.forFeature([Restaurant])],
  2. RestaurantService에서 repository를 사용하기 위해  
  >⭐constructor(
        @InjectRepository(Restaurant)
        private restarauntRepository: Repository<Restaurant>
      ){} 
  > Resolver에 import 함
  > Restaurant entity의 repository를 inject하고 있고 
  > ⭐repository를 inject하고 나면 restaurants.module에서 모든게 돌아간다
  > "모든 Restaurant을 가져오는 거다"
  > find 메서드는 async method여서 Promise<Restaurant[]>
   - this.restraunts. 메서드는 DB에서 모든걸 다 할 수 있게 해준다 
  > ⚡시험:  http://localhost:3000/graphql 
*/
/*#️⃣4.4 Create Restaurant 📄https://typeorm.io/
  1. 새로운 photo를 생성하는 예시
   - 문서: #Creating and inserting a photo into the database 
          let's create a new photo to save it in the database
    > 이건 javascript, typescript 측면에서 class를 생성하는 것밖에 안된다 
    >  🔴const newRestaurant = new Restaurant();
       🔴newRestaurant.name = createRestaurantDto.name 
    > ⭐TypeORM은 this.restaurants.create()라는 걸 사용 === "Creates a new entity instance."
  2. Restaurant entity는 DB에 실제로 있는 것이 아니라 javascript에만 있다
    > ⭐따라서 save메서드로 DB에 저장해야 한다! 
   
   
    🔹View(UI) - Controller - 도메인Model(비즈니스) 📄https://overcome-the-limits.tistory.com/648
    > 도메인 Model을 캡슐화, UI화면에서 사용하는 데이터만 선택적으로 보낼 수 있다 
   🔹 DTO(Data Transfer Object): 계층 간 데이터 교환을 위해 사용하는 객체 
    > View 사용자 요청 >  Controller는 요청을 해석  >  Model을 업데이트 또는 
      View <  Controller  < Model로 부터의 데이터 
      ⭐Controller는 Model과 View를 분리함으로써 의존성을 낮추고 독립적인 개발
        DTO를 통해 Model과 도메인View와 데이터를 주고 받을 때 별도의 DTO를 주로 사용
   🔹NestJS 개발: Layered Architecture 구조
     > Controller(Resolver) - Service - repository 를 활용
   🔹entity: 데이터베이스가 어떻게 구성되어있는지 알려주는 부분
*/
/*#️⃣4.5 Mapped Types
#3.4 ( create-restaurant.dto에 catoryName을 미기입 )
1. 🚨error: "categoryName" 칼럼의 null 값이 not null 제약조건을 위반했습니다.
  >🔴graphql과 entity가 통합되어서 발생하는 문제!!
  > sexy code 결과: Restaurant entity가 DB table과 graphql type, dto를 모두 만들어낼 수 있게 된다 
  Q. 그런데 매번  entity를 업데이트할 때마다 복붙하는 걸 기억하고 할 수 있나 ?
  A. Mapped types 사용
2. Mapped ty pes는 base type을 바탕으로 다른 버전들을 만들 수 있게 해준다 
 > 📄docs.nestjs.com/graphql/mapped-types#partial
 > Mapped types는 base type을 바탕으로 다른 버전들을 만들 수 있게 해준다 
*/
/*#️⃣4.8 Update Restaurant part Two
1. restaurants repository에서 update method를 사용
  > this.restaurants.update() 
  > 인수: 어떠한 기준이나 특징 
  > partialEntity: "update하고 싶은 entity의 field를 보내야 된다 "
  > update()는 db에 해당 entity가 있는지 확인하지 않고 update query를 실행한다는 말 
  > this.restaurants.update({name: "lalalala"}, {...data} ) "name lalala를 {...data}로 업데이트 하는 거다"
  > 현재 DB id가 5인 restaurant을 update 해볼거다 
  > [grapql]
   mutation {
    updateRestaurant(input: {
      id: 5,
      data: {
        name: "Updated !!!! "
      }
    })
   }

*/
/*#️⃣11.3 createRestaurant part Two
   1. slug 만들기
     🔹trim메소드: 양쪽 공백 제거
     🔹toLowerCase 메소드: 소문자로 변환 
*/
/*#️⃣11.9 Edit Restaurant part Three ~ #️⃣10.10 Edit Restaurant Testing
   1.🔷Custom repositories: 📄typeorm.io/#/custom-repository
     categories는 불려졌고 
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjY0OTM5MzM2fQ.BV5myZA10vef-xz-zZRQWRGyvLNUNsdotPLUI_tNS7M"
     admin@admin.com // 123,  user id:3 & restaurant id:1  >> name, adddress를 수정    
   */
 /*#️⃣11.15 Pagination
  1. find옵션 where은  Simple condition that should be applied to match entities.
   #️⃣11.17 Restaurant and Search ~ #️⃣11.18 Searchpart Two 
   1. 📄https://www.tutorialspoint.com/sql/sql-like-clause.htm
      📄http://www-db.deis.unibo.it/courses/TW/DOCS/w3schools/sql/sql_dates.asp.html#gsc.tab=0
     > SQL Tutorial
     > 예시1)WHERE SALARY LIKE '200%'  🔹"Finds any values that start with 200."
     > 예시2)WHERE SALARY LIKE '%200%'  🔹"Finds any values that have 200 in any position"
     > 예시3)WHERE SALARY LIKE '_00%' 🔹"Finds any values that have 00 in the second and third positions."
   2. ILIKE 에서 I는 'Insensitive'를 말한다 대문자 소문자 상관 안함
    - const [restaurants, totalResults] = await this.restaurants.findAndCount({
          where:{
            name: ILike(`%${query}%`)   
          }
      })

   3.Raw(name => `${name} ILIKE '%${query}%'`)   value를 argument로 주면 된다(🔹typeorm)
    - docs: 📄https://typeorm.io/find-options
    - 설명: typeorm에는 Raw((columAlias) => any)   
    - 예시) 
   4. SQL: ORDERED BY ===  
    const [restaurants, totalResults] = await this.restaurants.findAndCount({
          skip: (page - 1 ) * 3,
          take: 3,
          order:{
            isPromoted:'DESC',  
          } 
    }) 
    🔹 ORDERED BY "isPromoted" DESC, name DESC
      - 해석: isPromoted 필드는 오름차순(작은 값부터 ~ 큰 값 순으로 정렬) 
              name 필드는 내림차순 

    🔹field(entity): Every table is broken up into smaller called entities.
    🔹Reacord(Row): A record is also called as a row of data is each individual entry that exists in a table
    🔹column: A column is a vertical entity in a table that contain all information associated with a specific field in a table.  
    🔹NULL value: 변수를 선언 값을 할당, A NULL value is a vaule in a field
      vs undefined: 변수를 선언 + 값을 할당하지 않음 
    🔹SELECT column1, column2 ...columnN FROM table_name
    🔹SELECT column1 FROM table_name WHERE condition
    🔹SELECT DISTINCT Colmn: 중복제거 후 
      - SELECT 명령어는 중복된 커럼들도 모두 읽음   
    🔹UPDATE restaurant SET name = 'Guda423' WHERE id = 62
    🔹ANY 오퍼레이터: SELECT * FROM emp WHERE sal  = ANY(950 ,3000 ,1250)
    🔹BETWEEN 오퍼레이터: SELECT * FROM member WHERE age BTWEEN 20 AND 30 
      - 
    🔹EXISTS: 한 테이블이 다른 테이블과 외래키(FK)와 같은 관계가 있을 때 유용
        📄https://codingspooning.tistory.com/entry/MySQL-EXISTS%EC%99%80-IN-%EC%82%AC%EC%9A%A9%EB%B2%95-%EB%B9%84%EA%B5%90%ED%95%98%EA%B8%B0-%EC%98%88%EC%A0%9C
      - 예시) SELECT * FROM customers WHERE EXISTS(
                SELECT * FROM orders WHERE orders.cs_no = customers.cs_no
              )
    🔹IS NULL: "The NULL operator is used to campare a value with a NULL value"
      - 예시: SELECT * FROM "store_information" WHERE sales IS NULL
    🔹AS(ALIAS): 칼럼이나 테이블에 별칭을 붙임
      - 예시1: SELECT * FROM EX_TABLE AS A 
    🔹COUNT(칼럼): COUNT함수는 행의 개수를 센다. 그러나 해당 컬럼의 값이NULL인 행은 포함X
     - 블로그: 📄https://ggmouse.tistory.com/156
     - 사례) COUNT(*): NULL값을 포함한 모든 행의 개수를 반환 
             COUNT(1): NULL값을 제외한 모든 행 수를 카운트한다 
    🔹DELETE FROM table_name WHERE [condition]
      - 테이블 필드 전체 지우기: DELETE FROM restaurant      
    🔹ORDER BY   
      - 예시 SELECT * FROM restaurant ORDER BY id DESC
    🔹GROUP BY 기준: 기준은 여러개의 값을 가질 수 있는 것으로 정해야 한다 
      예) customer_id는 여러개의 payment_id를 가질 수있다   
      SELECT "customerId", SUM(total) FROM "order" GROUP BY "customerId"  
    🔹DISTINCT: The basic syntax of DISTINCT keyword to eliminate the duplicate records is as follow 
      SELECT DISTINCT "total" FROM "order"
    🔹CASE WHEN [condition] THEN [ 반환값 ] ELSE [반환값]: 
    🔹ELSE: CASE WHEN ~ THEN ~ "그렇지 않으면 "
       - [condition]에 만족하지 않을 경우 반환값
    🔹CASE문은 반드시 END로 끝내야 한다   
      - END AS hero_type 이 컬럼을 만들어 THEN반환값을 할당
    🚀                                                  ⚡
    +----+----------+-----+-----------+----------+      +----+----------+-----+-----------+----------+
    | ID | NAME     | AGE | ADDRESS   | SALARY   |      | ID | NAME     | AGE | ADDRESS   | SALARY   |
    +----+----------+-----+-----------+----------+      +----+----------+-----+-----------+----------+
    |  1 | Ramesh   |  32 | Ahmedabad |  2000.00 |      |  2 | Khilan   |  25 | Delhi     |  1500.00 |
    |  7 | Muffy    |  24 | Indore    | 10000.00 |      |  5 | Hardik   |  27 | Bhopal    |  8500.00 |
    |  6 | Komal    |  22 | MP        |  4500.00 | -->  |  3 | kaushik  |  23 | Kota      |  2000.00 |
    |  2 | Khilan   |  25 | Delhi     |  1500.00 |      |  6 | Komal    |  22 | MP        |  4500.00 |
    |  3 | kaushik  |  23 | Kota      |  2000.00 |      |  4 | Chaitali |  25 | Mumbai    |  6500.00 |
    |  5 | Hardik   |  27 | Bhopal    |  8500.00 |      |  7 | Muffy    |  24 | Indore    | 10000.00 |
    |  4 | Chaitali |  25 | Mumbai    |  6500.00 |      |  1 | Ramesh   |  32 | Ahmedabad |  2000.00 |
    +----+----------+-----+-----------+----------+      +----+----------+-----+-----------+----------+
  
      SELECT * FROM CUSTOMERS ORDER BY ( CASE ADDRESS
        WHEN 'Delhi'      THEN 1
        WHEN 'Bhopal'     THEN 2
        WHEN 'Kota'       THEN 3
        WHEN 'Ahmedabad'  THEN 4
        WHEN 'MP'         THEN 5
        ELSE 100 END) ASC, ADDRESS DESC 
      )
     🔹CASE ADDRESS >>   CASE WHEN ADDRESS = 'Delhi' 
      
  📄This will sort the customers by ADDRESS in your ownoOrder of preference first and
    in a natural order for the remaining addresses.Also, the remaining Addresses will be sorted in the reverse alphabetical order.
   
    🔹Insert Query: INSERT INTO [TABLE_NAME] VALUES (value1, value2, value3...)
     > 예시: INSERT INTO CUSTOMERS (ID, NAME, AGE, ADDRESS, SALARY)
             VALUES (1, 'SOOMAN', 34, 'HannamDong', $20,000)
     > 
    🔹the adimin privilege: 관리자 권한
    🔹CREATE DATABASE 이름
      > CREATE DATABASE TEST
    🔹DROP DATABASE TEST: 데이터베이스 삭제
    */
       
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditProfileOutput } from 'src/users/dtos/edit-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { Raw, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditrestaurantInput} from './dtos/edit-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dtos/my-restaurant.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';

import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';


@Injectable()
export class RestaurantService{
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish> 

  ){}
  
async getOrCreateCategory(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.categories.findOne({
        where :{
          slug: categorySlug 
        }     
      });
      if(!category) {
        category = await this.categories.save(
          this.categories.create({slug: categorySlug, name: categoryName })
        )
      }
      return category;
}

  // restaurant 레퍼지토리.create(dto) > .save > DB에 저장 
async createRestaurant( 
    owner:User,
    createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
    
    try{
      const newRestaurant = this.restaurants.create(createRestaurantInput) //Restraunt 인스턴스 생성 만드는 방법
      newRestaurant.owner = owner;
      const category = await this.getOrCreateCategory(
        createRestaurantInput.categoryName,
      )
      
      newRestaurant.category = category
      await this.restaurants.save(newRestaurant)
      return {
        ok:true,
        restaurantId: newRestaurant.id 
      };
    } catch(e) {
      console.log(e)
      return {
        ok: false,
        error: 'could not create restaurant!',
        
      }
    }
  }
async editRestaurant(
  owner:User,
  editRestaurantInput: EditrestaurantInput
  ): Promise<EditProfileOutput> {
    try{
      const restaurant = await this.restaurants.findOneOrFail({
        where:{
          id:editRestaurantInput.restaurantId
        }
      });
      if(!restaurant) {
        return {
          ok:false,
          error: 'Restaurant not found'
        }
      }  
       if(owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own"
        }
      }
      let category: Category = null; // 어떤 사람은 categoryName을 수정하고 싶지x => 기본값 null
      if(editRestaurantInput.categoryName) {
        category = await this.getOrCreateCategory(editRestaurantInput.categoryName)
      }  
       await this.restaurants.save([{
         id: editRestaurantInput.restaurantId,
         ...editRestaurantInput,
         ...(category&& {category}),
       }])
       
      return {
         ok: true,
       }
       } catch(e) {
         return {
           ok:false,
           error: "Cound not edit Restaurant"
         }
      }        
  }
  async deleteRestaurant(
      owner:User,
      { restaurantId }: DeleteRestaurantInput,
    ): Promise<DeleteRestaurantOutput> {
      try {
        const restaurant = await this.restaurants.findOneOrFail({
          where:{
            id:restaurantId
          }
        }) //레스토랑을 지우기 위해서 존재 유무
        if(!restaurant) {
          return {
            ok:false,
            error: 'Restaurant not found',
          };
        }
        if(owner.id !== restaurant.ownerId) {
          return {
            ok:false,
            error: "You can't delete a restaurant you don' own"
          }
        }
        await this.restaurants.delete(restaurantId) //레스토랑이 있으면 지울 것이고 
      } catch {
        return {
          ok:false,
          error: 'Could not delete restaurant'
          
        }
      }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
      try {
        const categories = await this.categories.find();
        return {
          ok:true,
          categories,
        };
      } catch{
        return {
          ok:false,
          error: 'Could not load categories',
        }
      }
  }


    // category.name
    countRestaurant(category: Category) {
      return this.restaurants.count({
        where:{
          category:!category
        }
      }); //category에 해당하는 restaurant을 세고 있음 
    }

     //10.15 Pagination - 예시) slug: korean-bbq -> categoryId:1
  async findCategoryByslug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
      try {
        const category = await this.categories.findOneOrFail({
          where:{ slug },

        })
        if(!category){
          return {
            ok: false, 
            error: 'Category not found',
          }
        }
        //🚨restaurants 콘솔 및 where옵션 확인!!
        const restaurants = await this.restaurants.find({
          where:{
            category:!category
          },
          order:{
            isPromoted:'DESC',
          },
          take: 25,
          skip: (page - 1) * 25,
        });
         
        category.restaurants = restaurants;
        const totalResults = await this.countRestaurant(category)
        return {
          ok: true,
          restaurants,
          category,
          totalPages: Math.ceil(totalResults / 25), 
          totalResults
        }
      } catch {
        return {
          ok: false,
          error: 'Could not load Category'
        }
      }
  }
  async allRestaurants(
      { page }: RestaurantsInput,
    ): Promise<RestaurantsOutput>{
      try {
        const [restaurants, totalResults] = await this.restaurants.findAndCount({
          skip: (page - 1 ) * 3,
          take: 3,
          order:{
            isPromoted:'DESC',
          } 
        })
        return {
          ok: true,
          results: restaurants,
          totalPages: Math.ceil(totalResults / 3),
          totalResults
        }
      } catch {
        return {
          ok: false,
          error: "Could not load restaurants"
        }
      }
  }
  async findRestaurantById({restaurantId}: RestaurantInput): Promise<RestaurantOutput> {
      try {
        const restaurant = await this.restaurants.findOneOrFail({
          where:{
            id: restaurantId,
          },
          relations:['menu']  //⭐restaurant에 가서 세부사항을 볼 때, menu를 불러올 수 있다
        })
        if(!restaurant) {
          return {
            ok: false, 
            error: 'Restaurant not found'
          }
        }
        return {
          ok: true,
          restaurant
        }
      } catch {
        return{
          ok: false,
          error: "Could not find retaurant"
        }
      }
  }
  async searchRestaurantByName({query, page}:SearchRestaurantInput): Promise<SearchRestaurantOutput> {
      try {
        const [restaurants, totalResults] = await this.restaurants.findAndCount({
          where:{
            name: Raw(name => `${name} ILIKE '%${query}%'`) //ILike(` %${query}%`) 
          }
        })
        return {
          ok: true,
          restaurants,
          totalResults,
          totalPages: Math.ceil(totalResults / 25)
        }
      } catch {
        return {
          ok: false,
          error: "Cound not search for restaurant"
        }
      }
  } 
  //이해: restaurant을 찾는다 > owner와 restaurant의 owner가 같은지 확인 > dish생성 > restaurant에 dish를 추가 
  async createDish(
    owner: User, 
    createDishInput:CreateDishInput
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOneOrFail({
        where:{
          id: createDishInput.restaurantId
        }
      })    
    if(!restaurant) {
      return {
        ok:false,
        error: "Restaurant not found",
      }
    }
    if(owner.id !== restaurant.ownerId) {
      return {
        ok:false,
        error: " You can't do that "
      }
    }
    await this.dishes.save(this.dishes.create(
      {...createDishInput, restaurant })
    )

    return {
      ok:true,
    }
  } catch (error) {
    console.log(error)
    return {
      ok:false,
      error: 'Cound not create dish'
    }
    }  
  }

  async editDish(
    owner:User, 
    editDishInput: EditDishInput
  ): Promise<EditDishOutput> {
    try {
      const dish = await this.dishes.findOneOrFail({
        where:{
          id: editDishInput.dishId
        },
        relations:['restaurant']
      })
    if(!dish) {
      return {
        ok:false,
        error: "Dish not found"
      }
    }
    if(dish.restaurant.ownerId !== owner.id) {
      return {
        ok:false,
        error: "You can't do that"
      }
    }
    await this.dishes.save([{
      id:editDishInput.dishId,
      ...editDishInput
    }])
    return {
      ok:true,
    }
    } catch {
      return {
        ok:false,
        error: "Could not edit Dish"
      }
    } 
  }

  async deleteDish(
    owner:User,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOneOrFail({
        where:{
          id: dishId
        },
        relations: ['restaurant'] //⭐dish가 restaurant를 가지고는 있지만, 이 relations를 load시켜줘야 )
      }) 
            
    if(!dish) {
      return {
        ok:false,
        error: 'Dish not found',
      }
    }
    if(dish.restaurant.ownerId !== owner.id) {
      return {
        ok:false,
        error: "You can't do that"
      }
    }
    await this.dishes.delete(dishId);
    return {
      ok:true,
    }
    } catch {
      return {
        ok: false,
        error: 'Could not delete Dish'
      }
    }
  }

  async myRestaurants(
    owner:User,
    
    ): Promise<MyRestaurantsOutput> {
    try{
      const restaurants = await this.restaurants.find({
        where:{
          owner: !owner
        }
      })   
      return {
        restaurants,
        ok:true 
      }
    } catch {
      return {
        ok:false,
        error: 'Could not find restaurants.'
      }
    }
  }

  // ownerId: owner.id,id
  

  async myRestaurant(
    owner: User,
    { id }: MyRestaurantInput,
  ): Promise<MyRestaurantOutput>{
    try {
      const restaurant = await this.restaurants.findOneOrFail({
        where:{
          owner:!owner,
          id
        },
        relations: ['menu', 'orders']
      })
      return {
        restaurant,
        ok: true,
      }
    } catch {
      return {
        ok: false,
        error: 'Could not find restaurant'
      }
    }
  }

}
