/* eslint-disable prettier/prettier */
import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Dish } from "../entities/dish.entity";

//✅내가 dish를 추가하려고 하면 어떤 restaurant에 추가할지 알아야한다 
@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'description',
  'options'
]) {
  @Field(type => Int)
  restaurantId: number;

}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}
