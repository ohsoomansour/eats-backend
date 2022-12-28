/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ID } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from 'src/common/common.constant';
import { Dish} from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order-dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput,  GetOrdersOutput } from './dtos/get-orders.dto';
import { TakeOrderInput, TakeOrderOutput } from './dtos/take-order.dto';
import { OrderItem } from './entities/order-item.entity';
/*#️⃣11.8 Create Order part Three
  1. email: "admin@admin.com"
     password: "123",  user   id:3 & restaurant id:1
     role:Owner
     "x-jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjY0OTM5MzM2fQ.BV5myZA10vef-xz-zZRQWRGyvLNUNsdotPLUI_tNS7M"
  
  2. email:"ceoosm@gmail.com",
     password:"284823",
     role:Client
     "x-jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjY1NDA0MzQyfQ.8iibfq5HS2aVxyAoiJQsu-Is8keGv33hNVQ5AdTcDag"
  
  3.id = 5
    email:"delivery@delivery.com",
    password:"123"
    role: Delivery   
    "x-jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjY1NDU2NzYwfQ.Z7QTod3Nsa8krtKuSmuQYjIOEm2Z3xUNALukhsRL4WY"
  4. dish엔티티 id:4 & restaurantId: 12 
  5.Order {
      customer: User {
        id: 4,
        createdAt: 2022-10-09T05:43:45.145Z,
        updatedAt: 2022-10-09T05:43:45.145Z,
        email: 'ceoosm@gmail.com',
        role: 'Client',
        verified: false
      },
      total: null,
      id: 1,
      createdAt: 2022-10-09T06:06:00.959Z,
      updatedAt: 2022-10-09T06:06:00.959Z,
      status: 'Pending'
    }   
     */
/*#️⃣11.3 getOrders and get Order 
     ✅ ...(category && {category})  === if(category) { return category }
    nico: "Yes, but this is the only way we can do it inside of an object."
    */ 
/*#️⃣12.10 orderUpdates part One
  1. Eager and Lazy Relations: 📄github.com/typeorm/typeorm/blob/master/docs/eager-and-lazy-relations.md
     - 의미: eager relations은 db에서 entity를 load할 때마다 자동으로 load되는 relationship을 말한다
      
*/
/*#️⃣13.0 Payment Introduction
    1.📄paddle.com - digital stuff만 결제가 가능하다 
    2.📄https://stripe.com/ - 실제 회사가 있어야 하고 한국은 지원을 하지 않음 
    3.📄braintreepayment.com - 
*/

import { Order, OrderStatus } from './entities/order.entity';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurants:Repository<Restaurant>,
    @InjectRepository(OrderItem)
    private readonly orderItem: Repository<OrderItem>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ){}

    async CreateOrder(
      customer:User, 
      {restaurantId, items}: CreateOrderInput
      ): Promise<CreateOrderOutput> {
        try {
          const restaurant = await this.restaurants.findOne({
            where:{
              id: restaurantId
            }
          })
          
          if(!restaurant) {
            return {
              ok:false,
              error: 'Restaurant not found'
            }
          }

          let orderFinalPrice = 0;
          const orderItems: OrderItem[] = [];
          for (const item of items) {
            const dish = await this.dishes.findOne({
              where:{
                id: item.dishId
              }
            });
            
            if(!dish){
              return {
                ok:false,
                error: "Dish not found"
              }
            }
            let dishFinalPrice = dish.price;
            for (const itemOption of item.options) {
              const dishOption = dish.options.find(
                dishOption => dishOption.name === itemOption.name 
              )
              if(dishOption) {
                if(dishOption.extra){
                  dishFinalPrice = dishFinalPrice + dishOption.extra;
                } else {
                  const dishOptionChoice = dishOption.choices?.find(
                    optionChoice => optionChoice.name === itemOption.choice
                  );
                  if(dishOptionChoice){
                    if(dishOptionChoice.extra) {
                      dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                    }
                  }
                }
              }
            }
            orderFinalPrice = orderFinalPrice + dishFinalPrice;
            const orderItem = await this.orderItem.save(
              this.orderItem.create({
              dish,
              options: item.options
              })
            ) 
            orderItems.push(orderItem)  
          }
          //console.log(orderFinalPrice);
          const order = await this.orders.save(
            this.orders.create({
              address:customer.address,
              customer,
              restaurant,
              total: orderFinalPrice,
              items: orderItems
            })
          )
          await this.pubSub.publish(NEW_PENDING_ORDER, {
            pendingOrders: {order, ownerId: restaurant.ownerId}
          }) 
          return {
            ok: true,
            orderId: order.id 
          }
        } catch(e) {
          console.log(e)
          return{
            
            ok:false,
            error: 'Could not create Order'
          }
        }
    }

    async getOrders(user:User, { status }:GetOrdersInput
      ): Promise<GetOrdersOutput> {
        try {
          let orders: Order[];
          if(user.role === UserRole.Client){
            orders = await this.orders.find({
             where:{
              customer:!user,
               ...(status && {status}) //객체 안에 있을 때만 가능함 > status가 'undefined'이면 빈 객체를 반환 함 
             }
               
           })
         } else if  (user.role === UserRole.Delivery){
            orders = await this.orders.find({
             where:{
               driver:!user,
             }
           })
      //owner가 user인 모든 음식점을 찾고,(우리는 restaurant을 load하고 싶지않음) orders를 select&load하는 거다   
         }  else if (user.role === UserRole.Owner) {
           const restaurants = await this.restaurants.find({
             where: {
               owner:!user
             },
             relations:['orders'],
 
           })

           orders = restaurants.map(restaurant => restaurant.orders).flat(1);
           if(status) {
            orders = orders.filter(order => order.status === status)
           }
          }
           return {
             ok: true,
             orders,
           }
         
        } catch  {
          return {
            ok: false,
            error: 'Could not get orders'
          }
        };
    }
    canSeeOrder(user:User, order:Order):boolean {
      let canSee = true;
      if(user.role === UserRole.Client && user.id !== order.customerId) {
        canSee = false;
      }
      if(user.role === UserRole.Delivery && user.id !== order.driverId) {
        canSee = false;
      }
      if(user.role === UserRole.Owner && user.id !== order.restaurant.ownerId ) {
        canSee = false;
      }
      return canSee
    }
    //order을 볼 수잇는 살마은 driver, customer, restuarant의 owner이다 
    async getOrder(
      user:User,
      {id: orderId}:GetOrderInput
      ): Promise<GetOrderOutput> {
        //🔴customerId 와 driverId는 load가 필요가 없기 때문에 relationId로 정리
        
        try {
          const order = await this.orders.findOne({
            where:{
              id: orderId,
            },
            relations:['restaurant']
             //⭐restaurant의 owner가 필요함 
            
          })
          
          if(!order) {
            return{
              ok:false,
              error: 'Order not found'
            }
          }
     
          if(!this.canSeeOrder(user, order)){
            return{
              ok:false,
              error: "You can't see that"
            }
          }
          return {
            ok: true, 
            order
          }
        } catch {
          return {
            ok: false,
            error: 'Could not get Order',
          }     
        }
      }
      async editOrder(
        user:User, 
        {id: orderId, status}: EditOrderInput
      ): Promise<EditOrderOutput> {
        try {
          const order = await this.orders.findOne({
            where:{
              id:orderId
            }     
          })
          
        if(!order) {
          return {
            ok:false,
            error:"Order not found"
          }
        }
        if(!this.canSeeOrder(user, order)){
          return{
            ok:false,
            error: "You can't see this."
          }
        }
        //✅Delivery & Owner만 edit 할 수 있다 > 그러나 두 사람이 edit 할 수있는 내용은 다르다
        let canEdit = true;
        if(user.role === UserRole.Client){
          canEdit = false;
        }
        
        if(user.role === UserRole.Owner) {
          if(status !== OrderStatus.Cooking && status !== OrderStatus.Cooked){
            canEdit = false;
          }
        }
        if(user.role === UserRole.Delivery) {
          if(status !== OrderStatus.PickedUp && status !== OrderStatus.Delivered){
            canEdit = false;
          }
        }
        if(!canEdit) {
          return {
            ok:false,
            error: "You can't do that"
          }
        }
    //🚨주어진 entity만 업데이트 되고, relations는 전혀 못 가져옴 : 배달원은 Order전체를 받아야 하므로 payload에 부적합
        await this.orders.save(
          {
            id: orderId,
            status
          }
        )
    //🚨order을 그대로 넣어주면 DB에서 status가 cooking인 상태를 넣어주게 됨 따라서, 명시적으로 '인수의 status'를 별도로 적시 
        const newOrder = { ...order, status }
        if(user.role === UserRole.Owner) {
          if(status === OrderStatus.Cooked){
            await this.pubSub.publish(NEW_COOKED_ORDER, {
              cookedOrders: newOrder
            })
          }
        }
        await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder })
          return {
            ok:true,
          }
          } catch {
            return {
              ok:false,
              error: "Coud not edit order"
            }
          }
        }
    async takeOrder(
      driver: User,
      { id: orderId }:TakeOrderInput
    ): Promise<TakeOrderOutput> {
      try{
        const order = await this.orders.findOne({
          where:{
            id: orderId
          }
        })
        if(!order){
          return{
            ok:false,
            error: 'order not found'
          }
        }
        if(order.driver) {
          return {
            ok: false,
            error: 'This order already has a driver'
          }
        }
        await this.orders.save([{
          id: orderId,
          driver
        }])
        await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: {...order, driver }})
        return {
          ok:true,
        }
      } catch {
        return{
          ok:false,
          error: 'Could not update order '

        }
        
      }
    }    
}  