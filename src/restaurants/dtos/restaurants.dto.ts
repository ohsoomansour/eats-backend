/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOuput } from "src/common/dtos/pagination.dto";
import { OneToMany } from "typeorm";
import { Dish } from "../entities/dish.entity";
import { Restaurant } from "../entities/restaurant.entity";

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantsOutput extends PaginationOuput {

  @Field(type => [Restaurant], {nullable: true })
  results?: Restaurant[];

  
}