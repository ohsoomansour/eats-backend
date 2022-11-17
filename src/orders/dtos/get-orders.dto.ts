/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Order, OrderStatus } from "../entities/order.entity";

/*#️⃣11.12 getOrders part One
1.[order.entity.ts]
  export enum OrderStatus{
    Pending = 'Pending',
    Cooking = 'Cooking',
    PickedUp = 'PickedUp',
    Delivered = 'Delivered',
  } 
2. 
*/
@InputType()
export class GetOrdersInput{
  @Field(type => OrderStatus, {nullable: true })
  status?: OrderStatus;
}

@ObjectType()
export class GetOrdersOutput extends CoreOutput{
   @Field(type => [Order], {nullable: true})
   orders?: Order[];
}