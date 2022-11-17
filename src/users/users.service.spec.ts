/* eslint-disable prettier/prettier */
/*#️⃣7.0 Setting Up Tests - ⭐"유닛 테스트의 키 포인트는 가능한 한 테스트들을 독립시키는 거다 ""
  1. "NestJs"는 테스트 모듈이 있다
     > import { Test } from "@nestjs/testing"; 
     > 모듈을 만듬 
  2. 우리하 해야 할 것은 서비스를 모듈 밖으로 불러내는 거 
  3. service = modules.get<UsersService>(UsersService);를 아래의 '모든 테스트'에서 이용하고 싶다 
    ->  it.todo('createAccount');
        it.todo('login');
        it.todo('findById');
        it.todo('editProfile');
        it.todo('verifyEmail');

  4. ⭐우리가 만든 서비스의 첫 테스트가 될 거다
     it(''shouldb e defined', () => { 
      expect(service).toBeDefined();
     })
  5. 유저 서비스만을 가진 독립된 모듈 
    const modules = await Test.createTestingModule({
      providers:[UsersService]
    }).compile();


  #️⃣7.1 Mocking
  1.🔴Cannot find module 'src/common/entities/core.entity' from 'users/entities/user.entity.ts'
  🔵경로의 문제: 'users/entities/user.entity.ts' -> 🚨Jest는 이런 방식을 못 쓴다
   [package.json]
   jest가 파일을 찾는 방식을 수정 
    > RexEXP 방식으로 src로 시작하는 경로에서 모든 경로는 rootDirectory에서 찾아라
    > "rootDir": "src",

   "jest": {
    "moduleNameMapper":{
      "^src/(.*)$": "<rootDir>/$1"  
    },

   2.🔴Nest can't resolve dependencies of the UsersService 
     🔴(?, VerificationRepository, JwtService, MailService). 
     🔴Please make sure that the argument UserRepository at index [0] is available in the RootTestModule context.
    🔵(Repository는 TypeORM에서 불러옴)Mock Repository를 제공할 거다
       🔹Mock: 가짜 함수 - 가짜 함수의 실행, 가짜 클래스의 실행
       ⭐Q. 그러면 왜 Mock을 이용 하느냐? 
          > 여기서는 UsersService를 단독으로 테스트하고 싶다
          > TypeORM에서 진짜 유저 Repository를 불러오고 싶지 않다 
            + Verification Repository, JwtService, MailService를 불러오고 싶지 않다
          > 유닛 테스트의 본질을 흐림

  3. getRepositoryToken(User): User 엔티티의 'Repository token'을 제공해준다 
   #️⃣7.2
   1. Partial<Record> 
     🔹Partial   
      - type Partial<T> = { [P in keyof T]?: T[P]; }
      - "Make all propertis in T optional" === "타입 T의 모든 요소를 optional 하게 만든다"
        let usersRepository: Partial<Record<"hello", string>>

     🔹<Record>   
      - type Record<K extends string | number | symbol, T> = { [P in K]: T; }
      - Construct a type with a set of properties K of type T 
        === "레코드는 타입 T의 요소 K의 집합으로 타입을 만들어주는 TypeSCript이다 "

       ⭐해석: Record type의 모든 프로퍼티는 옵셔널 + <Record<"hello", string>> 

   2. 우리가 할 건 UserRepository의 모든 함수를 가져오는 거다
     🔹Keyof Type Operator
        keyof 연산자는 객체 type을 사용하여 해당 키의 문자열 또는 숫자 리터럴 통합을 생성합니다.
        ```
        type Point = { x: number; y: number };
        const hello: keyof Point; // ⭐hello에는 x, y만 할당 가능
        ```
   3. ⭐keyof Repository<User> 프로퍼티는 findOne, save, create, update같은걸 모든걸 말한다 
      🔹T(=Type Variables): 하나의 타입만이 아닌 '다양한 타입'을 사용할 수 있도록 하는 기법 한법의 선언으로 다양한 타입에 
           재사용이 가능하다는 장점 
           T는 제네릭을 선언할 때 관용적으로 사용되는 식별자로 Type parameter라 한다 
           T는 Type의 약자로 반드시 T를 사용하여야 하는 것은 아니다

      예시) function sort<T>(item: T[]): T[] {
          return item.sort()
          }

        const nums: number[] = [1, 2, 3, 4];
        const chars: string[] = ['a', 'b', 'c'];

        console.log(sort<number>(nums));   // [ 1, 2, 3, 4 ]
        console.log(sort<string>(chars));  // [ 'a', 'b', 'c' ]

        🔹type객체
           type UserType = {
            name: string,
            age : number
           }
   #️⃣7.3 Writing Our First TEST
      1. mock은 DB 또는 TypeORM을 쓰지 않고 함수의 반환값을 속일 수 있기 때문
        > mockResolvedValue() => ⭐Promise.resolve(value));
        > ⭐우리는 코드의 출력값을 테스트하는게 아니라 코드 각 줄을 테스트 하는 거다

      2. 내가 nestjs 한테 [users.service.ts]의 findOne이 ✅{id:1, email: lalala}값을 해결 할거라고 말하고 있다
        describe("createAccount", () => {
          it("should fail if user exists", ()=>{
            usersRepository.findOne.mockResolvedValue(✅{
              id:1,
              email: 'lalalala'
            })
            ⭐아래의 실제 코드를 바꿔치기 함 
            service.createAccount({
              email: '',
              password: '',
              role: 0,
            })
          })
        })

      [users.service.ts]
       console.log(exists)     
      ✅{ id: 1, email: 'lalalala' }
   */ 

/*#️⃣7.5 createAccount Test part One
  1. reference Type: Object(object, funtion, array)  📄https://velog.io/@surim014/JavaScript-Primitive-Type-vs-Reference-Type
  🔴usersRepository.create 두 번 호출 하고 있다는 의미는 mockRepository가 객체이면 같은 주소를 참조 하기 때문에
     usersRepository, verificationsRepository 각각 1 한 번씩 중복 호출하고 있다고 생각

  🔹참조 타입의 데이터는 크기가 정해져 있지 않고 변수에 할당이 될 때 값이 직접 해당 변수에 저장될 수 없으며 
    변수에는 데이터에 대한 참조만 저장된다. ⭐변수의 값이 저장된 힙 메모리의 주소값을 저장한다
    참조 타입은 변수의 값이 저장된 메모리 블럭의 주소를 가지고 있고 자바스크립트 엔진이 변수가 가지고 있는 메모리 주소를 이용해서 
    변수의 값에 접근한다.
  🔹Jest cannot recognize the difference between UserMockRepository methods and VerificationMockRepository methods.
   > Since we put the same object (mockRepository) to both UserMockRepository and VerificationMockRepository
  🔹So, making mockRepository as a function that returns an object, 
    we can actually have two different mockRepository objects (even though their shapes are the same!)

   #️⃣7.6 createAccount Test part Two
   1.expect.any(String),주어진 어떠한 function의 type의 argument든 체크  

   #️⃣7.7 login Test part One ~ d7.8 login Test part Two
   1. { email}, {select: ["id", "password"] }
                    =
      { 
        where:{ email },
        select:["id","password"]
      }
   2. 🔹beforeEach : test모듈이 각 test 전에 다시 만들어진 거
      🔹beforeAll: test모듈 각 테스트 누적 (이해)
   3. mockResolvedValue  =  jest.fn(() => Promise.resolve(true))
   #️⃣7.9 findfByid Test
    🔹findOneOrFail: exception, erorr을 throw 할 거다
      - 만약 무언가를 찾으면 return할 거고, 못 찾으면 error가 나올 거다 
*/      
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { JwtService } from "src/jwt/jwt.service";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Verification } from "./entities/verification.entity";
import { UsersService } from "./users.service";
import { UserRole } from "./entities/user.entity";

 const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
 });
 const mockJwtService = () => ({
  sign: jest.fn(() => "signed-token-baby"),
  verify: jest.fn()
 });
 const mockMailService = () => ({
  sendVerifiacationEmail: jest.fn(),
 })

 type MockRepository<T = any > = Partial<Record<keyof Repository<T>, jest.Mock >>

describe("UserService", () => {

    let service: UsersService;
    let usersRepository: MockRepository<User>;  // Make all propertis in T optional
    let verificationsRepository: MockRepository<Verification>;
    let mailService: MailService;
    let jwtService: JwtService;

  beforeEach(async () => {
    const modules = await Test.createTestingModule({
      providers:[UsersService, {
        provide: getRepositoryToken(User),
        useValue: mockRepository(),
      },
      {
        provide: getRepositoryToken(Verification),
        useValue: mockRepository(),
      },
      {
        provide: JwtService,
        useValue: mockJwtService(),
      },
      {
        provide: MailService,
        useValue: mockMailService(),
      },
      ]

    }).compile(); 
      service = modules.get<UsersService>(UsersService);
      usersRepository = modules.get( getRepositoryToken(User) );
      verificationsRepository = modules.get( getRepositoryToken(Verification));
      mailService = modules.get<MailService>(MailService)
      jwtService = modules.get<JwtService>(JwtService);
  })

    
    it('should be defined', () => {
      expect(service).toBeDefined();
    })
    
    describe("createAccount", () => {
      const createAccountArgs = {
        email: 'ceoosm@naver.com',
        password: '284823',
        role: UserRole.Client,
      }
      it("should fail if user exists", async () => {
        usersRepository.findOne.mockResolvedValue({
          id:1,
          email: 'lalalala'
        })
          
        const reusult = await service.createAccount(createAccountArgs);
        expect(reusult).toMatchObject({
          ok: false,
          error: 'There is a user with that email already'
        })
      })
      it('should create a new user', async () => {
        usersRepository.findOne.mockResolvedValue(undefined);
        usersRepository.create.mockReturnValue(createAccountArgs);
        usersRepository.save.mockResolvedValue(createAccountArgs)
        verificationsRepository.create.mockReturnValue({
          user: createAccountArgs
        })
        verificationsRepository.save.mockResolvedValue({
          code: 'code',
        })
        const result = await service.createAccount(createAccountArgs);
        expect(usersRepository.create).toHaveBeenCalledTimes(1);
        expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs)
        expect(usersRepository.save).toHaveBeenCalledTimes(1);
        expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

        expect(verificationsRepository.create).toHaveBeenCalledTimes(1)
        expect(verificationsRepository.create).toHaveBeenCalledWith({
          user: createAccountArgs
        });
        expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
        expect(verificationsRepository.save).toHaveBeenCalledWith({
          user: createAccountArgs
        });
          
        expect(mailService.sendVerifiacationEmail).toHaveBeenCalledTimes(1);
        expect(mailService.sendVerifiacationEmail).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String),
        )
        expect(result).toEqual({ ok: true });
      })
      it('should fail on exception', async () => {
        usersRepository.findOne.mockRejectedValue(new Error(''))
        const result = await service.createAccount(createAccountArgs)
        expect(result).toEqual({ok:false, error: "Couldn't create account" })
      })
    })
    describe('login', () => {
      const loginArgs = {
        email: 'os@email.com',
        password: 'os.password'
      }
      it('should fail if user does not exist', async () => {
        usersRepository.findOne.mockResolvedValue(null)
        const result = await service.login(loginArgs)

        expect(usersRepository.findOne).toBeCalledTimes(1);
        expect(usersRepository.findOne).toBeCalledWith(
          expect.any(Object),
          
        );
        expect(result).toEqual({
          ok:false,
          error: 'User not found',
        })        
      })
     it('should fail if the password is wrong', async() => {
        const mockUser = {
          checkPassword: jest.fn(() => Promise.resolve(false))
        };
        usersRepository.findOne.mockResolvedValue(mockUser)
        const result = await service.login(loginArgs);
        expect(result).toEqual({ok:false, error: 'Wrong password' })
     }) 
     it('should return token if password correct', async () => {
      const mockUser = {
        id:1,
        checkPassword: jest.fn(() => Promise.resolve(true))
      };
      usersRepository.findOne.mockResolvedValue(mockUser) 
      const result = await service.login(loginArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number))
      expect(result).toEqual({ ok: true, token: 'signed-token-baby' })
     })

    })
    
    describe('findById', () => {
      const findByIdArgs = {
        id: 1,
      }
      it('should find an existing user', async() => { 
        usersRepository.findOneOrFail.mockResolvedValue({id: 1});
        const result = await service.findById(1)
        expect(result).toEqual({ ok: true, user: findByIdArgs })
      })
      it('should fail if no user is found', async () => {
        usersRepository.findOneOrFail.mockRejectedValue(new Error());
        const result = await service.findById(1)
        expect(result).toEqual({ ok: false, error: 'User Not Found' })

      })
    });

    describe('editProfile', () => {
      it('should change email', async() => {
        const oldUser = {
          email: "bs@old.com",
          verified: true,
        }
        const editProfileArgs = {
          userId:1, 
          input: {email: 'bs@new.com'}
        }
        const newVerification = {
          code: 'code',
        }
        const newUser = {
          verified: false,
          email: editProfileArgs.input.email
        }
        usersRepository.findOne.mockResolvedValue(oldUser);
        verificationsRepository.create.mockReturnValue(newVerification);
        verificationsRepository.save.mockResolvedValue(newVerification);

        await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
        expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
        expect(usersRepository.findOne).toHaveBeenCalledWith({where:{id: editProfileArgs.userId} });
        expect(verificationsRepository.create).toHaveBeenCalledWith({user: newUser})
        expect(verificationsRepository.save).toHaveBeenCalledWith(newVerification)
        expect(mailService.sendVerifiacationEmail).toHaveBeenCalledWith(
          newUser.email,
          newVerification.code
        )  
      
      })
      it('should change password', async () => {
        const editProfileArgs = {
          userId:1, 
          input: {password: 'new.password'}
        }
        usersRepository.findOne.mockResolvedValue({ password: 'old' })
        const result =  await service.editProfile(editProfileArgs.userId, editProfileArgs.input)
        expect(usersRepository.save).toHaveBeenCalledTimes(1);
        expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input)
        expect(result).toEqual({ok: true })
      });
      it('should fail on exception', async () =>{
        usersRepository.findOne.mockRejectedValue(new Error());
        const result = await service.editProfile(1, { email: '12'});
        expect(result).toEqual({ ok: false, error: 'Could not update profile.' })
      }) 
    });
    describe('verifyEmail', () => {
      it('should verify email', async () => {
        const mockedVerification = {
          user: {
            verified: false,
          },
          id:1
        }
        verificationsRepository.findOne.mockResolvedValue(mockedVerification);
        const result = await service.verifyEmail('');
        expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
        expect(verificationsRepository.findOne).toHaveBeenCalledWith(
          expect.any(Object),
        )
        expect(usersRepository.save).toHaveBeenCalledTimes(1);
        expect(usersRepository.save).toHaveBeenCalledWith({verified: true });
        expect(verificationsRepository.delete).toHaveBeenCalledTimes(1);
        expect(verificationsRepository.delete).toHaveBeenCalledWith(mockedVerification.id)
        expect(result).toEqual({ ok: true })
      })
      it('should fail on verification not found', async() => {
        verificationsRepository.findOne.mockResolvedValue(undefined);
        const result = await service.verifyEmail("")
        expect(result).toEqual({ ok: false, error: 'Verification not found.' })
      })
      it('should fail on ', async() => {
        verificationsRepository.findOne.mockRejectedValue(new Error(''))
        const result = await service.verifyEmail('')
        expect(result).toEqual({ ok: false, error: 'Could not verify email' })
      })
    });
})