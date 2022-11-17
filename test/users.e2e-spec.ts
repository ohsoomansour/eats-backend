/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from 'src/users/entities/verification.entity';
import { StringDecoder } from 'string_decoder';
/*#️⃣9.1 Setup part Two
1. 🚨Jest did not exit one second after the test run has completed.
  🔵뭔가가 종료되지 않은 상태에서 jest가 종료되었다 
  🔵앱을 종료시켜주는 코드를 작성
    afterAll(async () => {
      app.close()
    })

 2.⭐우리가 해야 하는 것은 test가 전부 끝난 후에 database를 drop하는 거    
  > 이를 위해 database와의 connection이 필요하다 
  > 🔷typeorm은 getConnection이라는 훌륭한 connection function이 있다
    📄 방법1.https://github.com/tada5hi/typeorm-extension#dropdatabase
    📄 방법2.https://typeorm.biunav.com/en/data-source.html 
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'geony',
        password: '1234',
        database: 'kuber-test',
      });
        const connection = await dataSource.initialize();
        await connection.dropDatabase();
        await connection.destroy();
        await app.close();

   #️⃣9.2 Testing createAccount part One
    import * as request from 'supertest';
   1. request(app.getHttpServer()).post('/graphql') " 이 URL로 posting할 거다 "     
   2. request(app.getHttpServer()).post('/graphql').send(⭐query)

   #️⃣9.3 Testing createAccount part Two   
   🚨(노랑)Jest did not exit one second after the test run has completed.
   🚨This usually means that there are asynchronous operations that weren't stopped in your tests
     Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
   1.🔵"test:e2e": "jest --config ./test/jest-e2e.json ✅--detectOpenHandles" 
    > at Object.obj.<computed> [as post] (../node_modules/supertest/index.js:28:14)
    > 해석: createAccount가 진행> 메일을 여러 번 보내게 됨, async함에 따라서 테스트가 계속 진행중이라는 의미    
   2. 
     🔹toBe: 정확하게 입력 > toBe('There is a user with that email already')
     🔹toEqual: '유형' 입력  > expect.any(String)
   3. expect( ,callBack) : expect(res => { console.log(res.body)} )
     > { data: { createAccount: { ok: true, error: null } } }
    
    #️⃣9.5 Testing userProfile
     문제1. id를 어떻게 접근 할 것인가 ? 
     접근1. let usersRepository: Repository<User>
           usersRepository = module.get<Repository<User>>(getRepositoryToken(User))  "user들의 Repository를 받아올 수 있음"
     접근2. userRepository의 접근가능 > database에 접근할 수 있다는 뜻 
           describe('usersProfile' () => {
            beforeAll(async () => {
              console.log(awiat usersRepository.find()) 
            })
           })

          ⭐console.log 
          [
            User {  
              id: 1,
              createdAt: 2022-09-29T05:43:18.146Z,
              updatedAt: 2022-09-29T05:43:18.146Z,
              email: 'nico@las.com',
              role: 1,
              verified: false
            }
          ] 
      */

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});
const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'nico@las.com',
  password: '12345'
}
describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let usersRepository: Repository<User>
  let verificationRepository: Repository<Verification>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationRepository = module.get<Repository<Verification>>(getRepositoryToken(Verification))
    await app.init();
  });
  afterAll(async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      database: 'nuber-eats-test',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '284823',
      synchronize: true,
      logging: false,
    });
    const connection = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    await app.close();
  });

  describe('createAccount', () => {

    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation{
            createAccount(input:{
              email:"${testUser.email}",
              password:"${testUser.password}",
              role:Owner
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation{
            createAccount(input:{
              email:"${testUser.email}",
              password:"${testUser.password}",
              role:Owner
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toBe(
            'There is a user with that email already',
          );
        }); 
    });
  });
  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
        query:`
        mutation{
          login(input:{
            email:"${testUser.email}",
            password:"${testUser.password}",
          }) {
            ok
            error
            token
          }
        }`
      })
      .expect(200)
      .expect((res) => {
        const {
          body:{
            data: { login }, 
          },
        } = res;
        expect(login.ok).toBe(true);
        expect(login.error).toBe(null);
        expect(login.token).toEqual(expect.any(String));
        jwtToken = login.token;
      });
    });
    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query:`
        mutation{
          login(input:{
            email:"${testUser.email}",
            password:"xxx",
          }) {
            ok
            error
            token
          }
        }`,
      })
      .expect(200)
      .expect((res) => {
        const {
          body:{
            data: { login }, 
          }
        } = res;
        expect(login.ok).toBe(false);
        expect(login.error).toBe('Wrong password');
        expect(login.token).toBe(null);
      })
    })
  })

  describe('userProfile', () =>{
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find()
      userId = user.id;
    })
    it("should see a user's profile", () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set("X-JWT", jwtToken)
      .send({
        query:`
         {
          userProfile(userId:${userId}){
            ok
            error
            user {
              id
            }
          }
        }`
      })
      .expect(200)
      .expect(res => {
        const { 
          body: {
            data: {
              userProfile: {
              ok,
              error,
              user: {id}
              },
            },
          },
        } = res;
        //console.log(res.body.data.userProfile.user)
        expect(ok).toBe(true);
        expect(error).toBe(null);
        expect(id).toBe(userId) 
      })
    });
    it("should not find a profile", () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set("X-JWT", jwtToken)
      .send({
        query:`
         {
          userProfile( userId:22 ){
            ok
            error
            user {
              id
            }
          }
        }`
      })
      .expect(200)
      .expect(res => {
        const { 
          body: {
            data: {
              userProfile: {
              ok,
              error,
              user,
              },
            },
          },
        } = res;
        //console.log(res.body.data.userProfile.user)
        expect(ok).toBe(false);
        expect(error).toBe("User Not Found");
        expect(user).toBe(null)
      })
    });
  })
   describe('me', () => {
    it('should find my profile', () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set("X-JWT", jwtToken)
      .send({
        query:`
        {
          me {
            email
          }
        }`
      })
      .expect(200)
      .expect(res => {
        //console.log(res.body)
        const {
          body: {
            data: {
              me: {
              email 
              }
            }
          }
        } = res;
        expect(email).toBe(testUser.email)          
      })
    })
    it('should not allow logged out user ', () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query:`
        {
          me {
            email
          }
        }`
      })
      .expect(200)
      .expect(res => {
        const {
          body: { errors },
        } = res;
        const [error] = errors;
        expect(error.message).toBe('Forbidden resource')
      })
    })
   });
  describe('editProfile', () => {
    const NEW_EMAIL = "nico@new.com"
    it('should change email', () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .set("X-JWT", jwtToken)
      .send({
        query:`
          mutation {
            editProfile(input:{
              email: "${NEW_EMAIL}"
            }) {
              ok
              error
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        const {
          body: {
           data: {
            editProfile: {ok, error }
           }
          }
        } = res;
        expect(ok).toBe(true)
        expect(error).toBe(null)
      })
    })
    it('should have new email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query:`
          {
            me {
              email
            }
          }
          `
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                me: { email }
              }
            }
          } = res;
        })
    })
  });
  describe('verifyEmail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] =  await verificationRepository.find()
      verificationCode = verification.code;
    })
    it('should verify email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query:`
            mutation {
              verifyEmail(input:{
                code:"${verificationCode}"
              }){
                ok
                error
              }
            }    
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                verifyEmail:{ ok, error }
              }
          }} = res;
          expect ( ok ).toBe(true)
          expect(error).toBe(null)
        })
      })
    it("should fail on verification code not found ", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query:`
            mutation {
              verifyEmail(input:{
                code:"xxx"
              })  
                ok
                error
              }
            }  
          `,
        })
        .expect(200)
        .expect(res => {
          const {
            body: {
              data: {
                verifyEmail:{ ok, error }
              }
          }} = res;
          expect ( ok ).toBe(false)
          expect(error).toBe("Could not verify email")
        })
      })
    })
});
