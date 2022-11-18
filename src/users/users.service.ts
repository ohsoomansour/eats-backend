/* eslint-disable prettier/prettier */
import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"; 
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput} from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { MailService } from "src/mail/mail.service";
import { VerifyEmailOutput } from "./dtos/verify-emaili.dto";

/*#️⃣4.4 Create Account Mutation part Two 
  1. ⭐계정을 만들 때는 많은 단계를 거침
    1.1 (사용자 데이터베이스에) 존재하지 않는 email인지 확인해야 한다 > 🔹새로운 User확인
    1.2 새로운 계정을 만들어준다 & 비밀번호를 hashing
    > 이 모든게 맞다면 'ok'를 리턴 또는 'error'를 리턴 
    *hash: 다양한 길이를 가진 데이터를 고정된 길이를 가진 데이터로 매핑(mapping)한 값이다

 2. find 메서드는 🔹async method여서 Promise<Restaurant[]> 리턴 
   - this.restraunts. 메서드는 DB에서 모든걸 다 할 수 있게 해준다
    *상세설명: restraunts:Repository<Restaurant>

 3. findOne은 '주어진 condition(환경)과 일치하는 첫 번째 entity 를 찾는다     
   - this.User의Repository.findOne(); 
    > '파라미터'를 넘기지 않고 호출하면, 해당 테이블에 존재하는 가장 첫 번째 객체가 가져와진다

  4. 🚨const exists = await this.users.findOne({ email }); 에러   
    > { email: string; }' 형식의 인수는 'FindOneOptions<User>' 형식의 매개 변수에 할당될 수 없습니다.
    > ⭐해결: typeorm 0.3.6기준 이후, const exists = await this.users.findOne({where:{ email }});

  5. restaurant 레퍼지토리.create(dto) > .save > DB에 저장 

    */
/*#️⃣4.9 Log In part Two
  1. find the user with the email
  2.⭐check if the password is correct
  3. make a JWT and give it to the user 
  4.특정 유저조회 
   - this.users.findOne({where:{ email }})
  5.
*/
/*#️⃣5.0 Introduction to Authentication
  1. 📄docs.nestjs.com/techniques/authentication
    >첫 번째, 수작업

    >두 번째, nest/passorts를 적용 > passort-jwt newstjs/jwt를 활용하는 방법
  2. ❗안 배운 것: [app.module.ts] - ConfigModule/TypeOrmModule/GraphQLModule을 아직 만들어 보지 않았다 
  3. token generation > 모듈로 적용 시켜 봄 
*/
/*#️⃣5.14 updateProfile part Two
  1.🚨 에러발생 이유 확인  
  async editProfile(userId:number, {email, password}: EditProfileInput ){
    console.log(userId, email, password )
    return this.users.update(userId, {email, password});
  }
    🔴4 ceoosm@gmail.com undefined  🔴not-null constraint을 위반 = db에 규칙에 맞지 않는 데이터를 저장하려 한다는 뜻
    🔵destructing, spread syntax를 써서 그렇다
      > 에러 해석: password를 수정 하고 싶을 수도 아닐 수도 있다! 그러니까 undefined값이 나오게 되니까 에러가 발생
      > editProfile(userId:number, editProfileInput: EditProfileInput )
*/
/*#️⃣5.15 updateProfile partThree - userId 에러발생   

  User {
  id: 4,
  createdAt: 2022-09-14T09:39:15.979Z,
🔴updatedAt: 2022-09-19T11:41:57.447Z,
  email: 'ceoosm@gmail.com',
  password: '$2b$10$irt9xRs2MB1Vypyt7U9wAunY/QgX6wSI2HUBavZ7wZrUEm/gVM/vu',  284823
  role: 0
}
   $2b$10$MIvk5sHjwFCUH1fndZCnlOMvhF2R1kx2vXjbjwdE6ayQ2/ivWng7K  🔵DB

🚨 에러가 {userId: number; }에 할당 할 수 없다 'FindOptionsWhere<User>'
  ⭐nico: When you do {userId} that is a shortcut for {userId:userId}
          Your user does not have a userId, you have to do {id:userId} because your user has id.
  📃https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#property_definitions
     id:4 email:ceoosm@gmail.com pw:284823
     
  🔵해결 방법1: User에서의 옵션은 id인데 user에게는 userId가 없으므로 {id: userId} 라고 명시 해줘야 한다 
  🔵해결 방법2: pgAdmin4에서 테이블 조회해서 중복되는 아이디가 있을 수 있음 따라서 중복 아이디 삭제!! 
     

   <SQL> 
   🔹테이블 내용 삭제: DELETE FROM "user" WHERE "id" = 1;  
   🔹테이블 조회: SELECT * FROM "user";
   🔹테이블 삭제: DROP TABLE "user";
   🔹(의존 테이블 있으면 같이)테이블 삭제:DROP TABLE "user" CASCADE;  (2개의 다른 개체에 대한 관련 항목 삭제)

  */
 /*#️⃣6.0 Verification Entity 
     verification 테이블에서 userID가 존재하는 이유:
     > That is a Foreign Key, we just save the ID so later we can use "eager" to load it.
   #️⃣6.2 Verifying User part One
   1.user를 verify 한다는 의미는 🚀verification code를 사용해서 ✅user의 verification을 찾는다
    > verified:false > verified: true러 바꿔줌

    >verified:true로 바꿔줌 

   2. [users.service.ts]
      async verifyEmail(code:string) {
        const verification = await this.verification.findOne({where:{code:code}})
        if(verification) {
          console.log(verification, 🔴verification.user)
        }
        return false;
      }

      @Mutation(returns => VerifyEmailOutput)
      verifyEmail(@Args('input') {code}: VerifyEmailInput){
        return this.usersService.verifyEmail(code);
      }
   
     [users.resolver.ts]
   3. Verification {
       id: 1,
       createdAt: 2022-09-20T08:32:42.785Z,
       updatedAt: 2022-09-20T08:32:42.785Z,
       code: 'a2d624a2-4ed5-4cb2-b833-f626ee9b7bb1'
     }

    4.🔴verification.user은 'undefined'이다 왜냐면 비용이 많이들기 때문 
      >🔵TypeORM이 이것을 다루도록 하는 방법: 분명하게 TypeORM에게 요구를 해준다
      >🔵relationship: @JoinColumn() 은 user
      4.1 const verification = await this.verification.findOne({where:{code:code}, loadRelationIds: true })
          Verification {
            id: 1,
            createdAt: 2022-09-20T08:32:42.785Z,
            updatedAt: 2022-09-20T08:32:42.785Z,
            code: 'a2d624a2-4ed5-4cb2-b833-f626ee9b7bb1',
          ✅user: 5
          } 5
      4.2 const verification = await this.verification.findOne({where:{code:code}, relations: ['user'] })
        Verification {
          id: 1,
          createdAt: 2022-09-20T08:32:42.785Z,
          updatedAt: 2022-09-20T08:32:42.785Z,
          code: 'a2d624a2-4ed5-4cb2-b833-f626ee9b7bb1',
          user: User {
            id: 5,
            createdAt: 2022-09-20T08:32:42.711Z,
            updatedAt: 2022-09-20T08:32:42.711Z,
            email: 'new@account.com',
            password: '$2b$10$4Aa5hIHMQIh8aziXgkr.3e3cYA.Iecj.tkc4VxNyysQqQPETirPuK',
            role: 0,
            verified: false
          } 
    5. 22.09.21 
      mutation{
        verifyEmail(input:{
          code:"6bffc9bb-d402-4e2c-bfa4-782b9b09eaf5"
        }) {
          ok
          error
        }
      }   

 */
/*#️⃣6.5 Milfun Setup ~ #️⃣6.6 Mail Module Setup
1. https://signup.mailgun.com/new/signup > 메일 가입시, 신용카드 등록 해야 5,000건의 무료 이메일을 보낼 수 있음!! 
    ceoosm@naver.com  / pw:tkfkdgodhtnakstnfm   
  > [Authorized Recipients] > ceoosm@naver.com Verified

2. 📄https://app.mailgun.com/app/dashboard  
3. 📄github.com/nest-modules/mailer > 설치: npm install --save @nestjs-modules/mailer nodemailer
  > https://nest-modules.github.io/mailer/  "당신의 인증 코드는 이런거, 이메일 템플릿"
4. npx nest g mo mail

#️⃣6.7 Maligun API
  1. fetch 하는 거 github.com/sindresorhus/got > npm install got
    > 
    {
  "X-jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY2NDIzNzY1OH0.JGG3-iTcgiLhdNKSwWnaKIJE1XiBh2kuZLd8pi1YCzM"
}
*/
@Injectable()
export class UsersService {
  
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification) 
    private readonly verification  : Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
    
  ){}
   
  async createAccount({ email, password, role}: CreateAccountInput ): Promise<CreateAccountOutput>
    {
      try {
        const exists = await this.users.findOneOrFail({where:{ email }});
        if (exists) {
          return {ok: false, error: 'There is a user with that email already' };
        }
        const user = await this.users.save(this.users.create({email, password, role}))
        const verification = await this.verification.save(
          this.verification.create({
            user,
          })
        );
        this.mailService.sendVerifiacationEmail(user.email, verification.code)
        return {ok: true};
      } catch (e) {
        return {ok:false, error: "Couldn't create account" }
    }
  };

  async login({email, password}: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOneOrFail(
        {
          where:{ email },
          select:["id","password"]
        });
      if(!user) {
        return {
          ok:false,
          error: 'User not found',
        }
      }
      //🚨위의 user와 아래의 user의미 해석 확인❗❗
      const passwordCorrerct = await user.checkPassword(password);
      if(!passwordCorrerct) {
        return {
          ok:false,
          error: 'Wrong password',
        };
      }

      const token = this.jwtService.sign(user.id)
      return {
        ok:true,
        token,
      }
    } catch(error) {

      return {
        ok:false,
        error,
      }
    }
  }
  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({where:{ id }});

        return {
          ok: true,
          user: user,
        }
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async editProfile(
    userId: number , 
    { email, password }: EditProfileInput 
    ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({where:{id:userId}});
      //console.log(userId, user)
      if (email) {
        user.email = email;
        user.verified = false;
        await this.verification.delete({user: { id: user.id }})
        const verification = await this.verification.save(
          this.verification.create({ user })
          );
        this.mailService.sendVerifiacationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  async verifyEmail(code:string): Promise<VerifyEmailOutput> {
    try{
      const verification = await this.verification.findOneOrFail(
        {
          where:{
            code:code},
         relations: ['user'] 
        });
      
      if(verification) {
        verification.user.verified = true;
        
        await this.users.save(verification.user)
        await this.verification.delete(verification.id)
        return { ok: true }
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error: "Could not verify email" };
    }
  }
}