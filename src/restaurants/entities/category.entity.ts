/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entity";

/*#๏ธโฃ10.0 Restaurant Models
  1. Many-to-one /one-to-many: ๐typeorm.io/#/many-to-one-one-to-many-relations
   > category๋ ๋ง์ restaurant๋ค์ ๊ฐ์ง ์ ์๋ค
   > ์ด ๋ผ๋ฆฌ์ ์ญ์ด ํ์ํ๋ค Restaurant =>  

 2.๐จquery failed: ALTER TABLE "restaurant" ADD "coverImage" character varying NOT NULL
      error: error: "coverImage" ์ด์๋ null ๊ฐ ์๋ฃ๊ฐ ์์ต๋๋ค
    ๐ตpostgresql table์ญ์  ๐https://minjii-ya.tistory.com/18
      > DROP TABLE restaurant;

*/

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()//โญ1.GraphQL ์คํค๋ง์ ์ํด์ 
@Entity() //โญ2. TypeORM์์๋ ์ฌ์ฉํ  ์ ์๊ฒ Entity๋ ๋ง๋ฌ (DB์ ์ ์ฅ๋๋ ์ค์  ๋ฐ์ดํฐ์ ํ์์ ๋ง๋ฌ)
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