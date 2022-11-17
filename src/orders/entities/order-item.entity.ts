/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType, } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish, DishOption } from "src/restaurants/entities/dish.entity";
import {Column, Entity, ManyToOne } from "typeorm";

/*#️⃣11.6 Order Items
  1. user가 원하는 dish랑  + user가 choice한 property를 저장해야 한다
     ✅저장🚀 > Restaurant, "이 사람은 빅 매콤치킨을 원하는 구나"       
     [GraphQL]
     ⭐메인음식 이름:American Chicken 
     + options: [
        ⭐DishOption
        { 
          name: "Spice Level",
          choices:[{name: "Little bit"}, {name: "kill me"}]
        },
        ⭐DishChoice
        {
          name:"Pickle",
          extra:1,
        },
        {
          name: "Size",
          choices:[{name: "L", extra:2}, {name: "XL", extra: 5}]
        }
      ]
     
   2. [order.entity.ts]
      @Field(type => [Dish])
      @ManyToMany(type => Dish)
      @JoinTable()  
      dishes:Dish[];  🔴이건 단지 Dish만 저장한다! 
      
   3. OrderItem은 Dish랑 연결 되어야 한다 
   4. [order.entity.ts]
      🔴relations로 하면 최근에 items를 변경하면 과거에 주문까지 싹 다 바뀜 
      🔵items는 order가 생성되고 완료 될 때 한번 저장 된다
        > 나중에 주인이 음식의 옵션(items)을 수젇해도 문제가 없다
           
*/
@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field(type => String)
  name: string;
  @Field(type => String , {nullable: true})
  choice?: string;
  
}

@InputType('OrderItemInputType', {isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity{
  @Field(type => Dish)
  @ManyToOne(
    type => Dish,
    {nullable: true, onDelete: 'CASCADE'}
  )
  dish:Dish;

  @Field(type => [OrderItemOption], {nullable: true})
  @Column( {type: 'json', nullable: true} )
  options?: OrderItemOption[];

}