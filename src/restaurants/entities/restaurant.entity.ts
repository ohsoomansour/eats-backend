/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, RelationId } from "typeorm";
import { Category } from "./category.entity";
import { Dish } from "./dish.entity";


/*#️⃣1.2 ObjectType
1. ObjectType: GraphQL 스키마의 대부분의 정의는 'object types'이다 
   정의하는 각 object type은 응용 프로그램 클라이언트가 상호 작용해야 하는 도메인 객체를 나타냄
   이 경우 code first 접근 방식을 사용하여 'TypeScript 클래스'를 사용하여 스키마를 정의하고 
   TypeScript 데코레이터를 사용하여 해당 클래스의 field에 주석을 추가 
  *니콜라스: GraphQL로 부터 받아온 ObjectType
  ⭐"ObjectType은 자동으로 🔹'스키마를 빌드'하기 위해 사용하는 GraphQL decorator이다"
2. @Field(type => String)
 - 첫 번째 argument: returnTypeFunction? "첫 번째 argument로써 function을 요청하는 거다 "
  
*/
/*#️⃣3.0 Our First Entity(TypeORM) 📄https://typeorm.io/entities
  1. 데이터 베이스에 저장되는 '데이터의 형태'를 보여주는 모델 같은거다
  2. Entity is a class that maps to a database table "Entity는 DB 테이블에 매핑되는 클래스이다 "
  *매핑(Mapping): 매핑이란 해당 값이 다른 값을 가리키도록 하는 것, 일련의 객체들을 한 장소에서 다른 곳으로 이동
   디스크 상의 프로그램 모듈들을 '메모리'에 사상된다 
  🔹예시 
  import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

  @Entity() ⭐"Entity는 TypeORM이 DB에 아래의 것을 저장하게 해준다"
  export class User {
      @PrimaryGeneratedColumn()
      id: string

      @Column() ⭐"firtstName, lastName, isActive가 Column으로 DB에 저장되고 있다"   
      firstName: string

      @Column()
    lastName: string

      @Column()
      isActive: boolean
}
3. TypeORM에서도 사용할 수 있게 Entity도 만듬 
  > ❗TypeORM에 우리가 만든 Entity가 어디 있는지 알려줘야 함 
  > TypeOrmModule.forRoot({ eintities:[Restaurants] }) 📁./restaurants/entities/restaurant.entity 
  
4. TypeORM이 Entity를 찾고 알아서 migration 해주는거다 (synchronize: true)
 - WHERE "cls" AND "table_name" - 'restaurant' ....   "DB의 구성을 자동으로 바꿔주는 거다"
5.  TypeORM이 자동으로 migration 하지 않고 ⭐수동 migration 
6. pgAdmin4 > nuber-eats > (오른쪽 마우스) query tool >   SELECT * FROM restaurant; ⚡

*/
/*#️⃣3.1 Data Mapper vs Active Record 
    ⭐  CRUD 기능을 구현한다 했을떄 매 쿼리마다 바로 new User() 등을 사용해 객체를 생성해서 제공되는 메서드를 사용해 DB 에접근하는 방식
출처: https://huniroom.tistory.com/entry/NestJS-TypeOrm-Active-Record-패턴vs-Data-Mapper-패턴 [Tunko Development Diary:티스토리]
1. 🔴어떻게 Typescript를 이용해서 DB에 있는 Restaurant에 접근할 수 있을까 ?
   > TypeOrmModule에서 Repository 사용 > https://typeorm.io/active-record-data-mapper
   ⭐Data Mapper:( DB와 상호작용할 때 쓰는 패턴) Repository사용
   > Repository는  Entity랑 상호작용하는걸 담당
   > USer Entity에 접근하기 위해 > getRepository(User)를 사용하면 된다

  🔹Query: 웹 서버에 특정한 정보를 보여달라는 웹 클라이언트 요청, DB로부터 특정한 주제어를 찾기 위해 사용
  🔹SQL(Structured Query Language):관계형 데이터베이스(RDBMS)의 데이터를 관리 및 처리하기 위해
  🔹entity: 실체,객체(명사) '업무상 관리가 필요한 것' 서비스안에서 '저장되어야 하는 어떠한 것'
     - 설명:인스턴스의 집합 
  🔹자신(entity)이 가지고 있는 있는 인스턴스를 설명할 수 있는, 나타낼 수 있는 '속성(Attribute)'을 가짐
  🔹CRUD: Create Read Update Delete   
  🔹@Field: 클래스 내부에 '변수'에 사용 
  🔹@Prop: entity의 속성 
  🔹Schema: '형태', '모양', '데이터의 구조', '골격구조'
    - Deep한 자료: 📄https://www.hedleyonline.com/ko/blog/%EC%8A%A4%ED%82%A4%EB%A7%88%EC%97%90-%EB%8C%80%ED%95%9C-%EB%AA%A8%EB%93%A0%EA%B2%83-2022/ 
    - 데이터 베이스 스키마는 데이터 개체(entity), 속성(Attribute), 관계(Relationship), 데이터 값들이 갖는 제약 조건
    - 데이터베이스의 구조와 제약조건에 관한 전반적인 명세를 기술한 메타데이터의 집합이다 
    - 스키마는 자료의 구조나 표현방법, 자료간의 관계를 형식 언어로 정의한 구조이기 때무에 DB 관리 시스템이 '주어진 설정'
      에 따라 데이터베이스 스키마를 생성
   🔹왜래 키: 유저 테이블 <--연결--> (user_id:1, 외래 키) 주문 테이블이 가지고 있음
   🔹class-validator: 📄https://github.com/typestack/class-validator
     @IsString() 예시
     class BaseContent{
      @IsString()
      password:string;
     }
     class User extends BaseContent {
      @MinLength(12)
      password:string;
     }

    

2. NestJs + TypeORM 개발 환경에서 Repository를 사용하는 모듈을 쓸 수 있기 때문 
3. Repository를 사용하면 어디서든지 접근할 수가 있다 + 실제로 구현하는 서비에서 접근이 가능하고 
  + 테스팅할 때도 접근 가능
  + 서비스를 '유닛 테스팅' 할 때 DB에 접속하는걸 시연 해봄 
4. ⭐NestJS에서 자동으로 Repository를 사용할 수 있도록!>  ⚡클래스에서 알아서 준비해준다 
*/
/*#️⃣3.3 Recap - "전체적인 시스템을 이해하는게 중요❗"
1. ⭐TypeORM(entity)을 graphQL의 ObjectType옆에 쓰기만 하면 
 > DB에 model을 생성하고 자동으로 graphQL에 스키마를 작성
 > [restaurant.resolver.ts]의 graphQL query를 사용할 수 있는 resolver도 사용할 수 있다 <- 🚀service연결
 > [restaurant.service.ts]에서 service가 DB에 접근함 
*/
/*#️⃣3.5 Mapped Types
1. 둘중 하나 선택 
export class CreateRestaurantDto extends OmitType(Restaurant, ['id'], InputType) {} 
@InputType({ isAbstract: true }) "abstract는 직접 쓰는게 아니라 어떤 것으로 확장시킨다는 의미"
*/
/*#️⃣3.6 optional Types and Columns
1. 
 @IsBoolean() 
 @IsOptional() "이 필드가 없다면 무시하고 진행"
 isVegan: boolean;
2. ⭐graphql > database > validation 3번씩 테스트
3.  
⭐
graphql 실행시 > console.log(createRestaurantDto); 
@Field(type => Boolean, {defaultValue: true} )
{
  name: 'without vegan',
  isVegan: true,
  address: 'lalala'
}
 ⭐nullable > graphql 의 doc를 보면 defaultValue를 가지고 있지 않다 
@Field(type => Boolean, {nullable: true} 
*/
/*#️⃣Relations and InputTypes
  1. @ManyToOne(
      type => Category,
      category => category.restaurants
      {nullable: true, onDelete: 'SET NULL'}
    )
   category: Category
    > ⭐해석: category를 지울 때, restaurant은 category를 가지지 않게 된다 
    > ⭐해석추가: category를 지웠을 때 restaurant는 지워지지 않게 하기 위해서
  2. 📄https://project-notwork.tistory.com/20
    🔹onDelete: 'SET NULL' 
      > 개체를 변경/삭제할 때 다른 개체가 변경/삭제할 개체를 참조하고 있을 경우 참조하고 있는 값은 NULL로 세팅됩니다
    🔹CASCADE
      > 개체를 변경/삭제할 때 다른 개체가 변경/삭제할 개체를 참조하고 있을 경우 함께 변경/삭제됩니다.  
    🔹RESTRICT
      > 개체를 변경/삭제할 때 다른 개체가 변경/삭제할 개체를 참조하고 있을 경우 변경/삭제가 취소됩니다.
    🔹NO ACTION: MYSQL에서는 RESTRICT와 동일합니다.

   3. 🚨Schema must contain uniquely named types but contains multiple types names "Category" 
     🔵ObjectType과 InputType이 같은 name을 사용하고 있을 때 에러가 발생
      📄https://graphql.org/learn/schema/#gatsby-focus-wrapper
        type Character {
          name: String!
          appearsIn: [Episode!]!
        }
        🔹Character is GraphQL Object Type
        🔹name and appearIn are fields on the Character type
        🔹String is one of the buil-in scalar types
        🔹String! String! means that the field is non-nullable, meaning that the GraphQL service promises to always give you a value when you query this field
        🔹presents an array of Episode objects. Since it is also non-nullable, you can always expect an array 
        */
/*#️⃣10.8 Edit Restaurant part Two
  1. 📄github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#relationid
   @RelationId
*/
@InputType("RestaurantInputType", { isAbstract: true })
@ObjectType()//⭐1.GraphQL 스키마을 위해서 
@Entity() //⭐2. TypeORM에서도 사용할 수 있게 Entity도 만듬 (DB에 저장되는 실제 데이터의 형식을 만듬)
export class Restaurant extends CoreEntity {

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;
  
  @Field(returns => String)
  @Column()
  @IsString()
  coverImage: string;
  
  @Field(type => String, )
  @Column()
  @IsString()
  address: string;
  
  @Field(type => Category,{ nullable: true})
  @ManyToOne(
    type => Category,
    category => category.restaurants,
    {nullable: true, onDelete: 'SET NULL', eager: true}
  )
  category: Category;
  
  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.restaurants,
    {onDelete: 'CASCADE' }
  )
  owner: User;

  @RelationId((restaurant:Restaurant) => restaurant.owner )
  ownerId: number;

  @Field(type => [Order])
  @OneToMany(
    type => Order,
    order => order.restaurant
  )
  orders: Order[];

  @Field(type => [Dish])
  @OneToMany(
    type => Dish,
    (dish) => dish.restaurant
  )
  menu: Dish[];

  //🚨error: "isPromoted" 열에는 null 값 자료가 있습니다 > 🔵restaurant은 이미 존재하지만, 아직 isPromoted가 Column이 없어서 그렇다
  @Field(type => Boolean,  )
  @Column({default: false })
  isPromoted: boolean; 

  @Field(type => Date, {nullable:true})
  @Column({nullable:true})
  promotedUntil: Date;
}