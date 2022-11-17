/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/users/entities/user.entity";

// metadata 혹은 role이 any로 설명되어 있으면 너는 그 결과를 실핼할 수 있다는 뜻 
export type AllowedRoles = keyof typeof UserRole | 'Any';

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
