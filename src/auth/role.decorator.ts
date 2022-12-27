/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/users/entities/user.entity";

/* 🔷SetMetadata 
  📄https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata
  metadata 혹은 role이 any로 설명되어 있으면 너는 그 결과를 실행할 수 있다는 뜻
    export enum UserRole {
      Client = "Client" ,
      Owner = "Owner"  , 
      Delivery ="Delivery" ,
    }

*/
export type AllowedRoles = keyof typeof UserRole | 'Any';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
