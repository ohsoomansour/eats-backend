/* eslint-disable prettier/prettier */

import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entities/category.entity";

/*📄https://stackoverflow.com/questions/71557301/how-to-workraound-this-typeorm-error-entityrepository-is-deprecated-use-repo
  1.#️⃣10.9 Edit Restaurant part Three
    🚨@EntityRepository depreciate 문제 발생 >> npm i typeorm@0.2.45
  2. [restaurants.modul.ts]
    @Module({
      imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],  "Inject위해 임폿"
      providers: [RestaurantResolver, RestaurantService],
    })
      
*/
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.findOne( {where : { slug: categorySlug } });
      if(!category) {
        category = await this.save(
          this.create({slug: categorySlug, name: categoryName })
        )
      }
      return category;
  }
}