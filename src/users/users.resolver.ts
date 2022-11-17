/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.docator";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput  } from "./dtos/user-profile.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { VerifyEmailInput, VerifyEmailOutput } from "./dtos/verify-emaili.dto";
import { Role } from "src/auth/role.decorator";

/*#️⃣5.10 AuthUser Decorato
1. login안 되어있다면 request를 멈춤
   login되어있다면 request를 진행시킨다 

2.⭐resolver에서 request를 보내고 있는 것이 무엇인지 알아야 된다  
  @Query(returns => User)
  @UseGuards(AuthGuard)

  me( ) {}
*/
/*#️⃣5.14 updateProfile part Two
  1.🔴password가 해시화 되지 않음
    🔵[user.entity.ts]
      🚧@BeforeInsert()🚧  ▶@BeforeInsert() +  @BeforeUpdate()   
  
  2.🔴typeorm이  @BeforeUpdate() hook을 부르지 못하고 있다 
    > [users.service.ts] 우리는 users repository에서 this.users.update()를 쓰고 있다 
    > [📄upadate 설명서] Unlike save method executes a primitive operation without cascades, relations and other operations included. Executes fast and efficient UPDATE query. 
        Does not check if entity exist in the database.
    🔵 BeforeUpdate는 특정 entity를 update해야 부를 수 있다
    > [📄BeforeUpdate() ]Calls a method on which this decorator is applied before this entity update.
    > [users.service.ts] ⭐this.users.save 사용 

*/
@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService ) {}

  @Mutation(returns => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
   ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
   };
  
  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput ): Promise<LoginOutput>{
    return this.usersService.login(loginInput);
  }

  @Query(returns => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User  ) {

    return authUser;
  }

  //Promise<Entity | null>;
   
  @Query(returns => UserProfileOutput)
  @Role(['Any'])
  async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput>  {
    return this.usersService.findById(userProfileInput.userId);
  }



  @Mutation(returns => EditProfileOutput)
  @Role(['Any'])
  async editProfile(
    @AuthUser() authUser: User, 
    @Args('input') editProfileInput: EditProfileInput 
    ): Promise<EditProfileOutput>{
      return this.usersService.editProfile(authUser.id, editProfileInput );
    }



  @Mutation(returns => VerifyEmailOutput)
   verifyEmail(@Args('input') { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(code);
  }
}