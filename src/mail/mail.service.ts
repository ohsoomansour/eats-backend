/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { EmailVar, MailModuleOptions } from './mail.interface';
import got from 'got';
import * as FormData from "form-data";
/*#️⃣6.5 Milfun Setup ~ #️⃣6.6 Mail Module Setup
1. https://signup.mailgun.com/new/signup > 메일 가입시, 신용카드 등록 해야 5,000건의 무료 이메일을 보낼 수 있음!! 
    ceoosm@naver.com  / pw:tkfkdgodhtnakstnfm   
  > [Authorized Recipients] > ceoosm@naver.com Verified

2. 📄https://app.mailgun.com/app/dashboard  
  🔷메일건은 소유하고 있는 도메인을 이용하여 쉽게 도메인 이메일을 제작할 수 있게 도와주는 서비스
3. 📄github.com/nest-modules/mailer > 설치: npm install --save @nestjs-modules/mailer nodemailer
  > https://nest-modules.github.io/mailer/  "당신의 인증 코드는 이런거, 이메일 템플릿"
4. npx nest g mo mail

#️⃣6.7 Maligun API
  1. fetch 하는 거 github.com/sindresorhus/got > npm install got
    > API로 post 리퀘스트 

  2. 📄https://app.mailgun.com/app/sending/domains/sandboxe12c792632e642eebf5532b4c8889b94.mailgun.orgcurl 
   > curl -s --user 'api:YOUR_API_KEY'  유저네임:패스워드
     -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' 

    🔹curl: 서버와 통신할 수 있는 커맨드 명령어 툴이다
            URL로 데이터를 전송하기 위한 커맨드 라인 툴 및 라이브러리 

    🔹-s: --silent뜻이며 정숙모드 진행 내역이나 메세지등을 출력하지 않는다  📄https://shutcoding.tistory.com/23
    🔹--user: basic authorization 커맨드 > 유저명과 패스워드가 필요하다 
    🔹-F form이란 뜻
     📄form data npm:  https://www.npmjs.com/package/form-data"Form > npm i form-data
      > node.js에서 A library to create  readable"multipart/form-data" streams
      
  3. 'api: YOUR_API_KEY' String값의 포맷을 -> 🔷"인코딩하고 바꿔야 한다"  
    ⭐ 방법: base64형식의 인코딩
    [Node.js에서 하는 방법]
      3.1 powershell에서 node치고 
      > 🔷Buffer.from('api:YOUR_API_KEY').toString('base64')
          Buffer.from('api:1adeeac5512df33fb1867067aaa43906-78651cec-8937a66a').toString('base64')
      > 🔷'YXBpOllPVVJfQVBJX0VLWQ=='

   4. console.log(response.body);
     > {"id":"<20220922071514.b908a25cd3c82779@sandboxe12c792632e642eebf5532b4c8889b94.mailgun.org>","message":"Queued. Thank you."}    
    
     #️⃣6.8 Beautiful Emails
    1. 🔹sending 형식: 📄https://documentation.mailgun.com/en/latest/api-sending.html#sending

    email:"new@gmail.com",  >> "new1@gmail.com"
    password:"284823",
     */
@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {//this.sendEmail('testing', 'test') NestJS가 시작할 때 마다 이 함수를 테스트한다는 뜻 
    } 
     async sendEmail(
      subject: string, 
      template: string, 
      emailVars: EmailVar[]
    ): Promise<boolean> {

      const form = new FormData();
      
      form.append(
      "from",
       `SM from Nuber Eats <mailgun@${this.options.domain}>`
      )
      form.append("to", `ceoosm@naver.com`)
      form.append("text", subject)
      form.append("template", template)
      form.append('v:username', 'ohsoomansour')
      emailVars.forEach(eVars => form.append(`v:${eVars.key}`, eVars.value))
      try{
        await got.post(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        
        headers: {
          "Authorization":`Basic ${Buffer.from(
            `api:${this.options.apiKey}`,  
          ).toString('base64')}`
        },
        body: form,
      });

      return true;
      
      }catch(error){
        console.log(error)
        return false;
        
      }
    }
    sendVerifiacationEmail(email: string, code: string) {
      this.sendEmail('Verify Your Email', 'nubereats', [
        { key: 'code', value: code },
        { key: 'username', value: email }
      ] 
      )
      
    }
}
