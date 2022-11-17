/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";
/*#️⃣6.0 Verification Entity
  1. 📄typeorm.io/#/one-to-one-relations
    > Verification Entity는 오직 한명의 User만 가질 수 있다는 거다
      한명의 User도 오직 하나의 Verification을 가질 수 있다  

  2. @OneToOne(type => Profile"유저")
    if) User로부터 Verification에 접근하고 싶다면 🔹JoinColumn이 User 쪽에 있어야만 한다 
    반대로) Vertification으로 부터 User를 접근하고 싶다면 🔹JoinColum이 Verification에 있으면된다 

  3. TypeOrmModule.forRoot({
      entities:[User, Verification]✅ 
    }), 
  4. pgAdmin4 에 userId가 나타남   
*/
/*#️⃣6.1 Creating Verifications
   1.hook을 만들거다
  ⭐ verification entity에 code 생성하는 부분을 넣는 이유 
    🔷다른 곳에서도 verification을 생성 할 수 있도록 한다 
      [users.service.ts] createAccount를 할 때 verification을 생성
      [users.service.ts] editProfile를 할 때 verification을 생성
   
    2. @BeforeInsert()
        createCode():void {
          this.code = "random code"
       }
      🔹@BeforeInsert: You can define a method with any name in entity and mark it with @BeforeInsert 
        and TypeORM will call it before the entity is inserted using repository/manager save.
        (※Entity 안의 내용 참고) 
       
    3. 랜덤 문자열 생성
      3-1)Math.random().toString(36).subString(2, 12) > 'rv9yy40k7t'
     
      3-2)📃npmjs.com/package/uuid > npm i uuid > import { v4 as uuidv4 } from 'uuid';
          uuid4(); ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    
    4.mutation {
      createAccount(input: {
        email: "new@account.com",
        password: "121212",
        role:Client
      }) {
        ok
        error
      }
    }
    5.pgAdmin4 확인 > SELECT * FROM "verification"; > a2d624a2-4ed5-4cb2-b833-f626ee9b7bb1
    > userId(외부 키) = user entity의 id와 같음 
*/
/*#️⃣6.2 Verifying User part One
1. relationship을 갖고있는 entity를 찾게 된다면 어떻게 되는지 보여주고 싶었다 
2. localhost:3000/graphql
    > 
*/

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity{

  @Column()
  @Field(type => String )
  code:string;

  @OneToOne(() => User, {onDelete:"CASCADE" })
  @JoinColumn()
  user:User
  
  @BeforeInsert()
  createCode():void {
    this.code = uuidv4();
  }
}