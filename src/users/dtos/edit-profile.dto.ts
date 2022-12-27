/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
//🔵Mapped Types
@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ["email", "password", "address"])){}


