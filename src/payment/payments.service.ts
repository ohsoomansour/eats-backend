/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Cron, Interval, SchedulerRegistry, Timeout } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { LessThan, Repository } from "typeorm";
import { CreatePaymentInput, CreatePaymentOutput } from "./dtos/create-payment.dto";
import { GetPaymentOutput } from "./dtos/get-payments.dto";
import { Payment } from "./entities/payment.entity";
import { MoreThan } from "typeorm"
/*#️⃣13.3 createPayment part Two
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
*/
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private scheduleRegistry: SchedulerRegistry
  ){}
  //⭐createPayment를 하면 restaurant은 promote(홍보)되어야 한다 === "결제를 하면 레스토랑의 광고가 된다"
  async createPayment(
    owner:User,
    {restaurantId, transactionId}: CreatePaymentInput
  ): Promise<CreatePaymentOutput> {
    //restaurant
    try {
      const restaurant = await this.restaurants.findOne(restaurantId)
        if(!restaurant){
          return {
            ok:false,
            error:'Restaurant not found '
          }
        }
        if(restaurant.ownerId !== owner.id) {
          return {
            ok: false,
            error: 'You are not allowed to do this'
          }
        }
        await this.payments.save(
          this.payments.create({
            transactionId,
            user:owner,
            restaurant
          })
        )
        restaurant.isPromoted = true;
        const date = new Date();
        date.setDate(date.getDate() + 7);
        restaurant.promotedUntil = date;
        this.restaurants.save(restaurant)
        return {
          ok:true, 
        }    
    } catch {
      return {
        ok:false,
        error: 'You could not create payment'
      }
    }
  }
  
  async getPayments(owner:User): Promise<GetPaymentOutput> {
    try {
      const payments = await this.payments.find({user: owner})
      return {
        ok: true,
        payments
      }
    } catch {
      return {
        ok: false,
        error: 'Could not load payments'
      }
    }
  }
  //📄github.com/typeorm/typeorm/blob/master/docs/find-options.md#advanced-options
  @Interval(10000)
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date())
    })
    
    restaurants.forEach(async restaurant => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant)
    })
  }
}