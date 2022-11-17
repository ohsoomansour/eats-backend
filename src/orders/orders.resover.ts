/* eslint-disable prettier/prettier */
import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthUser } from "src/auth/auth-user.docator";
import { Role } from "src/auth/role.decorator";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.constant";
import { User } from "src/users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order-dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { GetOrdersInput, GetOrdersOutput} from "./dtos/get-orders.dto";
import { OrderUpdatesInput } from "./dtos/order-update-dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";

/*#️⃣13.5 Subscription Filter
   1. filtering을 해야하는 이유: 모든 update를 listen할 필요가 없다
     
*/
@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject(PUB_SUB) private readonly puSub: PubSub
  ){}

  @Mutation(returns => CreateOrderOutput )
  @Role(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput
  ): Promise<CreateOrderOutput> {
    return this.orderService.CreateOrder(customer, createOrderInput)
  }
  

  @Query(returns => GetOrdersOutput )
  @Role(["Any"])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrderInput: GetOrdersInput
  ): Promise<GetOrdersOutput> {
    return this.orderService.getOrders(user, getOrderInput)
  }

  @Query(returns => GetOrderOutput)
  @Role(['Any'])
  async getOrder(
    @AuthUser() user:User,
    @Args('input') getOrderInput: GetOrderInput
  ): Promise<GetOrderOutput>{
    return this.orderService.getOrder(user, getOrderInput);
  }
  
  @Mutation(type => EditOrderOutput)
  @Role(['Any'])
  async editOrder(
    @AuthUser() user:User,
    @Args('input') editOrderInput: EditOrderInput
  ): Promise<EditOrderOutput> {
    return this.orderService.editOrder(user, editOrderInput)
  }

  /* @Mutation(returns => Boolean)
  async potatoReady(@Args('potatoId') potatoId: number) {
    await this.puSub.publish('hotPotatos', {
      readyPotato: potatoId,✅
    });
    return true;
  }

  @Subscription(returns => String, {
    filter:({ readyPotato }, { potatoId } ) => {
      ⚡console.log(payload, variables, context)   
      return readyPotato === potatoId✅
    },
    ⭐"resolve는 사용자가 받는' update 알림의 형태'를 바꿔주는 일 또는 'response의 모습'을 바꿈"
      resolve: ({readyPotato}) => `Your potato with the id ${readyPotato} is ready`
  })
  @Role(['Any'])
  readyPotato(@Args('potatoId') potatoId: number ) {
    return this.puSub.asyncIterator('hotPotatos');   
  } */
  @Subscription(returns => Order, {
    //✅order가 만들어진 restaurant이 context.User의 restaurant인지 체크
    filter:({pendingOrders:{ownerId}}, _, {user}) => {
      
      return ownerId === user.id
    },
    resolve:({pendingOrders: {order}}) => order,
    
  })
  @Role(['Owner'])
  pendingOrders() {
    return this.puSub.asyncIterator(NEW_PENDING_ORDER)
  }

  @Subscription(returns => Order )
  @Role(['Delivery'])
  cookedOrders() {
    return this.puSub.asyncIterator(NEW_COOKED_ORDER)
  }  

  @Subscription(returns => Order, {
    filter:(
      { orderUpdates: order }: { orderUpdates: Order}, //🔹object type 예시  
      { input }: { input: OrderUpdatesInput }, //🔹variable의 이름은 'input'
      { user }: {user: User}
    ) => {
      //✅order에 관련된 사람들: owner, customer, driver 3명만❗ order의 update를 볼 수있다 
      if (
        order.driverId !== user.id &&
        order.customerId !== user.id &&
        order.restaurant.ownerId !== user.id
        
      ) {
        return false;
      }
      return order.id === input.id
    }
  })
  @Role(['Any'])
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orderUpdates(@Args('input') orderUpdatesInput: OrderUpdatesInput) {
    return this.puSub.asyncIterator(NEW_ORDER_UPDATE)
  }
  //⭐delivery driver를 order에 등록하는 거다 

  @Mutation(returns =>TakeOrderOutput)
  @Role(['Delivery'])
  takeOrder(
    @AuthUser() driver:User,
    @Args('input') takeOrderInput: TakeOrderInput
  ): Promise<TakeOrderOutput> {
    return this.orderService.takeOrder(driver, takeOrderInput)
  }


}