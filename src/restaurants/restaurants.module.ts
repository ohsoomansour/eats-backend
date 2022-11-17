/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { CategoryResolver, DishResolver, RestaurantResolver } from './restaurants.resolver';
/* #️⃣3.2 📄https://docs.nestjs.com/techniques/database
 1.restaurant.module에서 restaurant repository가 필요하다 
   > TypeORM을 이용해서 Restaurant repository를 import 했다, 여러 entity들이라면 []
   > ⭐imports: [TypeOrmModule.forFeature([Restaurant])],
  2. RestaurantService에서 repository를 사용하기 위해  
  >⭐constructor(
        @InjectRepository(Restaurant)
        private restarauntRepository: Repository<Restaurant>
      ){} 
  > Resolver에 import 함
  > Restaurant entity의 repository를 inject하고 있고 
  > repository를 inject하고 나면 restaurants.module에서 모든게 돌아간다   
*/
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category, Dish])],
  providers: [
    RestaurantResolver, 
    RestaurantService, 
    CategoryResolver,
    DishResolver,
  ],
  exports:[]
})
export class RestaurantsModule {
  static forRoot: any;
}
