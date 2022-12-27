/* eslint-disable prettier/prettier */
import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsNumber } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId } from "typeorm";
import { OrderItem } from "./order-item.entity";

/*
1. 용어정리

🔹onDelete: "RESTRICT" | "CASCADE" | "SET NULL"  - 참조된 row 삭제 시 '참조하는 외래키의 동작 방식'을 설정
🔹nullable:boolean - 관계의 열이 nullable인지 여부를 나타냄 기본적으로는 nullable
*/

export enum OrderStatus{
  Pending = 'Pending',
  Cooking = 'Cooking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, {name: 'OrderStatus'})

@InputType('OrderInputType', {isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity{

  @Field(type => User, {nullable: true })
  @ManyToOne(
    type => User,
    user => user.orders,
    {onDelete: 'SET NULL', nullable: true, eager: true  }
  )
  customer?: User

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field(type => User, {nullable: true })
  @ManyToOne(
    type => User,
    user => user.rides,
    {onDelete: 'SET NULL', nullable: true, eager: true  }
  )
  driver?:User;

  @RelationId((order:Order) => order.driver)
  driverId: number;
    
  @Field(type => Restaurant )
  @ManyToOne(
    type => Restaurant,
    restaurant => restaurant.orders,
    {onDelete: 'SET NULL', nullable: true, eager: true  }
  )
  restaurant?:Restaurant;


  //📄typeorm.io/#/many-to-many-relations > data에 어떻게 접근하는지에 따라 달라짐  
  @Field(type => [OrderItem])
  @ManyToMany(type => OrderItem)
  @JoinTable() //🔷소요하고 있는 쪽의 relation에 추가하면된다 
  items: OrderItem[];
  

  @Column({nullable: true })
  @Field(type => Float ) //소수점 Y
  @IsNumber()
  total?: number;
  
  @Column({ type: 'enum', enum: OrderStatus, default:OrderStatus.Pending})
  @Field(type => OrderStatus)
  @IsEnum(OrderStatus)
  status:OrderStatus;

  //ALTER TABLE order ADD email VARCHAR(100)
  @Column({nullable:true})
  @Field(type => String)
  address:string;
}