/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Order } from "src/orders/entities/order.entity";
import { Payment } from "src/payment/entities/payment.entity";
/*#️⃣User Model
1. User는 3개의 role
 - role(client(배고픈 사람) | owner | delivery ) > "어떤 걸로 등록했는지에 따라 다른 것들을 보게 됨"
 - 
2. PostgreSQL Client Tool
 - pgAdmin4
   > 테이블 전체 조회: SELECT * FROM PG_STAT_USER_TABLES;
 - postico: mac용
*/
/*#️⃣Create Account Mutation part One
 1.@InputType({ isAbstract: true }) "abstract는 직접 쓰는게 아니라 어떤 것으로 🔹확장시킨다는 의미"
   > 따라서 스키마에 해당 InputType이 포함되지 않게된다.
  - InputType과 ArgsType 모두 Query혹은 Mutation에서 🔹'Argument들을 받고자할 때' 사용할 수 있다

  #️⃣4.4 Create Account Mutation part Two
  1. enum UserRole {
      Client,
      Owner,
      Delivery,
    }
    
  ⚡@Column({ type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    role: UserRole;  
  */
/*#️⃣4.7 Hashing Passwords
  1.What is an Entity Listener? 📄https://typeorm.io/listeners-and-subscribers
    - Any of your entities can have methods with custom logic that listen to specific entity events.
  
  2.@BeforeInsert: You can define a method with any name in entity and mark it with @BeforeInsert 
  and TypeORM will call it before the entity is inserted using repository/manager save.
   (※Entity 안의 내용 참고)

  3. bcrypt 📄https://www.npmjs.com/package/bcrypt 
    > 설치: npm i bcrypt > npm i @types/bcrypt --dev-only
    > 임포트: import * as bcrypt from "bcrypt"; 

  - 개념: hash하고 & hash확인에 활용
  - npm > To hash a password: (중요부분)
    🔹saltOrRound: salt를 몇 번 돌릴거냐는 뜻. default: 10, 놆을 수록 암호화가 강력해지지만 속도는 느려짐
  - [users.service.ts]에서 await this.users.save(this.users.create({email, password, role}))
    > this.users.create({email, password, role}) (인스턴스를 이미 가지고 있음) 
    > await bcrypt.hash(this.password, 10);
    🔹InternalServerErrorException(): service파일 내부에서 catch한다
      >의미해석: (DB 저장하기 전에 서버에서 에러 발생 ) > 🚨{ok:false, error: "Couldn't create account" }
  4.SQL 
   🔹테이블 내용 삭제: DELETE FROM "user" WHERE "id" = 1;  
   🔹테이블 조회: SELECT * FROM "user";

 */
/*🚧Column없음 & 주문서에서 주소 받고 경로 그리기🚧
  1.@Column() "Column decorator is used to mark a specific class property as a table column"
    > null값이라도 있어야 한다 
  2. nullable:true는 값이 null을 허용, 칼럼 자체가 없다 
    ⭐해결1)칼럼 자체를 생성
      SQL - ALTER TABLE "user" ADD address VARCHAR(100)
      🔹varchar(100): 가변길이 문자열
  
    ⭐해결2) createAccount에 주소 추가 
      > [create-account.dto.ts] @InputType에서 "address" 추가 
      >  
    ⭐해결3) editProfile에 주소 추가   
    ⭐해결4)프론트[dashboard.tsx]: FULL_ORDER_FRAGMENT > +address 수정 > condegen(graphql-codegen)
      > subscription cookedOrders에서 user의 address를 받아옴   



*/
export enum UserRole {
  Client = "Client" ,
  Owner = "Owner"  , 
  Delivery ="Delivery" ,
}

registerEnumType(UserRole, { name: 'UserRole'});

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity{
  
  @Column({ unique: true })
  @Field(type => String)
  @IsEmail()
  email:string;

  @Column({select: false, })
  @Field(type => String)
  password:string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;
  

  @Column({default: false})
  @Field(type => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field(type => [Restaurant])
  @OneToMany(
    type => Restaurant,
    restaurant => restaurant.owner
  )
    restaurants:Restaurant[];

  @Field(type => [Order])
  @OneToMany(
    type => Order,
    orders => orders.customer
  )
  orders:Order[];
  
  @Field(type => [Payment])
  @OneToMany(
    type => Payment,
    payment => payment.user,
    { eager:true }
  )
  payments:Payment[];
  
  @Field(type => [Order])
  @OneToMany(
    type => Order,
    orders => orders.driver
  )
  rides:Order[];



  @Column({nullable:true})
  @Field(type => String)
  @IsString()
  address:string;
  
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch(e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch(error) {
      
      throw new InternalServerErrorException();
    }
  }

  
} 