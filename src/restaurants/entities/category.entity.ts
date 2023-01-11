/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entity";

/*#️⃣10.0 Restaurant Models
  1. Many-to-one /one-to-many: 📄typeorm.io/#/many-to-one-one-to-many-relations
   > category는 많은 restaurant들을 가질 수 있다
   > 이 논리의 역이 필요하다 Restaurant =>  

 2.🚨query failed: ALTER TABLE "restaurant" ADD "coverImage" character varying NOT NULL
      error: error: "coverImage" 열에는 null 값 자료가 있습니다
    🔵postgresql table삭제 📄https://minjii-ya.tistory.com/18
      > DROP TABLE restaurant;

*/

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()//⭐1.GraphQL 스키마을 위해서 
@Entity() //⭐2. TypeORM에서도 사용할 수 있게 Entity도 만듬 (DB에 저장되는 실제 데이터의 형식을 만듬)
export class Category extends CoreEntity {

  @Field(type => String)
  @Column({ unique: true })
  @IsString()
  @Length(5)
  name: string;
  
  @Field(returns => String, {nullable: true })
  @Column({nullable: true })
  @IsString()
  coverImage: string;

  @Field(type => String)
  @Column({unique: true })
  @IsString()
  slug:string;

  @Field(type => [Restaurant])
  @OneToMany(type => Restaurant, (restaurant) => restaurant.category,  )
  restaurants: Restaurant[]

  
}