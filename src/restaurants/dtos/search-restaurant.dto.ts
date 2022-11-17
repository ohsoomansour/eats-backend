/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { PaginationInput, PaginationOuput } from "src/common/dtos/pagination.dto";
import { Restaurant } from "../entities/restaurant.entity";

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field(type => String)
  query:string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOuput {
  @Field(type => [Restaurant], {nullable: true})
  restaurants?: Restaurant[];
}