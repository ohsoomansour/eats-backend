/* eslint-disable prettier/prettier */
import { Field, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
/*#️⃣4.1 User Model
  1. createdAt: Date;
     updatedAt: Date;
  2. 📄https://typeorm.io/entities#special-columns > #S  pecial Columns
    - @CreateDateColumn: "이column은, entity를 만들었을 때 자동으로 설정해 주는 special column"
    - @UpdateDateColumn
    - @DeleteDateColumn
    - @VersionColumn


 */
@ObjectType()
@Entity()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @CreateDateColumn()
  @Field(type => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(type => Date)
  updatedAt: Date;

}