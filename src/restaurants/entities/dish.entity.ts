/* eslint-disable prettier/prettier */
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Restaurant } from "./restaurant.entity";

/*#️⃣11.0 Dish Entity ~ #️⃣11.1 Create Dish part One
 1.
 🚨TypeORMError:ERROR [ExceptionHandler] Entity metadata for Restaurant#menu was not found.
 Check if you specified a correct entity object and if it's connected in the connection options.
 🔵[app.module.ts]
    TypeOrmModule.forRoot({
      entities:[Dish]
    })

 2. @Column({type:"json"})
   - json type은 기본적으로 json data를 저장
   - 구조화된 데이터를 저장 하거나 특정 형태를 가진 데이터를 저장해야 할 때, json type을 사용한다
   - json은 PostgreSQL, MySQL에서 지원하는 data type이다 
   
 */


@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field(type => String)
  name: string;
  @Field(type => Int, {nullable: true })
  extra?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field(type => String)
  name: string;
  @Field(type => [DishChoice], {nullable: true})
  choices?:DishChoice[];
  @Field(type => Int, {nullable: true })
  extra?: number;
}


@InputType('DishInputType', {isAbstract: true }) //foreigh key인 restaurant도 필요하다 > 왜냐하면 Restaurant은 Dish를 가지고 있음
@ObjectType() //⭐GraphQL 스키마를 위해서
@Entity() //⭐2. TypeORM에서도 사용할 수 있게 Entity도 만듬 (DB에 저장되는 실제 데이터의 형식을 만듬)
export class Dish extends CoreEntity {
  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name:string;
   
  @Field(type => [DishChoice], { nullable: true })
  choices?:DishChoice[];


  @Field(type => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(type => String, {nullable: true })
  @Column({nullable: true })
  @IsString()
  photo:string;

  @Field(type => String)
  @Column()
  @Length(5, 140)
  description: string;

  //식당안에 반드시 음식이 있어야 하므로 {nullable: false} > @ManyToOne은 {nullable: true }이 기본값 
  @Field(type => Restaurant)
  @ManyToOne(
    type => Restaurant,
    restaurant => restaurant.menu,
    { onDelete: 'CASCADE'}
  )
  restaurant:Restaurant;
  

  @RelationId((dish: Dish ) => dish.restaurant)
  restaurantId:number;

  @Field(type => [DishOption], {nullable: true})
  @Column( {type: 'json', nullable: true} )
  options?: DishOption[];
}
