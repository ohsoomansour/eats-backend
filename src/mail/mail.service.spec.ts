/* eslint-disable prettier/prettier */

/*#️⃣8.3 sendVerification Email Test
  1. sendEmail은 '테스트'를 해야 하니까 mock하지 않음 
   > 함수를 mock할 수 없을 때 spy를 사용
   🔹spy: 함수를 염탐한다는 것 
   🔹mockImpletation: sendEmail이 호출됐을 때, 그 콜을 가로채서
     sendEmail내용 = implementation들을 전부 mock할 수 있다
     즉, 나만의 구현(implementation)을 추가할 수 있다

  #️⃣8.4 sendEmail  Test
  1. 🚨TypeError: can not read property 'default' of undefined 
    > jest.mock('got', () => {}); "아무 것도 리턴하지 않음 => undefined "
  2. jest가 우리 대신에 got을 mock한다 = "모듈 자체를 mock" 
   > jest.mock('got')

  3.🚨 TypeError: FormData is not a constructor
  ✅[mail.service.ts]
   const form = new FormData();가 원래 있는데 아래처럼 Object로만 반환 하고 있다
  🔴[mail.servic.spec.ts] 
  jest.mock('form-data', () =>{
    return {
      append:jest.fn();
    }
   }) 

*/
import { Test } from "@nestjs/testing";
import * as FormData from 'form-data';
import got from 'got';
import { CONFIG_OPTIONS } from "src/common/common.constant";
import { MailService } from "./mail.service";

jest.mock('got');
jest.mock('form-data')

const TEST_DOMAIN = 'TEST-domain';

describe('MailService', () => {
  let service: MailService;
  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers:[
        MailService,
        {
          provide:CONFIG_OPTIONS,
          useValue: {
            apiKey: 'TEST-apiKey',
            domain: 'TEST-domain',
            fromEmail: 'TEST-fromEmail',
          }
        }
      ]
    }).compile();
    service = module.get<MailService>(MailService);
  })
  
  it('should be defined', () =>{
    expect(service).toBeDefined();
  })
  describe('sendEmail', () => {
    it('should call sendEmail', ()=>{
      const sendVerifiacationEmailArgs= {
        email: 'email',
        code: 'code',
      }
    jest.spyOn(service, 'sendEmail').mockImplementation(async() => true )
    service.sendVerifiacationEmail(
      sendVerifiacationEmailArgs.email,
      sendVerifiacationEmailArgs.code
    );
    expect(service.sendEmail).toHaveBeenCalledTimes(1);
    expect(service.sendEmail).toHaveBeenCalledWith(
      'Verify Your Email', 
      'nubereats', 
      [
        { key: 'code', value: sendVerifiacationEmailArgs.code },
        { key: 'username', value: sendVerifiacationEmailArgs.email }
      ] 
    )
    })
  })
  describe('sendEmail', ()=>{
    it('send email', async () => {
      const ok = await service.sendEmail('', '', [])
      const formSpy = jest.spyOn(FormData.prototype, "append");
      expect(formSpy).toHaveBeenCalled();
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object)
      );
      expect(ok).toEqual(true);
    });
    it('fails on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() =>{
        throw new Error();
      })
      const ok = await service.sendEmail('', '', [])
      expect(ok).toEqual(false);
    })
  })
})