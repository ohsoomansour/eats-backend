/* eslint-disable prettier/prettier */
import { Test } from "@nestjs/testing"
import { verify } from "crypto";
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from "src/common/common.constant";
import { JwtService } from "./jwt.service"

/*#️⃣8.1 JWT Sign Test
  1. JWT Sign Test 
   실제 npm package: import *as jwt from "jsonwebtoken"; 
   > 우리가 만든 것 sign:jest.fn(() => 'TOKEN')
   > 예시: console.log(jwt.sign({id: 1}, 'lalalala'))
   > // TOKEN

  2. 아래의 의미 해석: 실제 jwt.sign의 인수에 들어가는 this.options.privateKey
    대응 해보면 CONFIG_OPTIONS값 { privateKey: TEST_KEY}로 설정 하였다는 것을 인지 해야함
    {
      provide: CONFIG_OPTIONS,
      useValue: { privateKey: TEST_KEY}
     } 

*/
const TEST_KEY = 'testKey'
const USER_ID = 1
jest.mock('jsonwebtoken', () => {
  return {
    sign:jest.fn(() => 'TOKEN'),
    verify: jest.fn(() => ({id: USER_ID }))
  }
})

describe('JwtService', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers:[
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY}
        }
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed token', () => {
      const token = service.sign(USER_ID)
      expect(typeof token).toBe('string');
      expect(jwt.sign).toBeCalledTimes(1);
      expect(jwt.sign).toBeCalledWith({id: 1}, TEST_KEY)
    })
  });
  describe('verify', () => {
    it('should return the decoded token ', () => {
      const TOKEN = "TOKEN"
      const decodedToken = service.verify(TOKEN);
      expect(decodedToken).toEqual({ id: USER_ID })
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY)
    })
  });
})