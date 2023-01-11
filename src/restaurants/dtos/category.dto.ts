/* eslint-disable prettier/prettier */

import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { PaginationInput, PaginationOuput } from "src/common/dtos/pagination.dto";
import { CoreEntity } from "src/common/entities/core.entity";
import { Category } from "../entities/category.entity";
import { Restaurant } from "../entities/restaurant.entity";

@InputType()
export class CategoryInput extends PaginationInput{
  @Field(type => String)
  slug: string;

}

@ObjectType()
export class CategoryOutput extends PaginationOuput{
  @Field(type => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
  
  @Field(type => Category, {nullable: true })
  category?: Category;
}