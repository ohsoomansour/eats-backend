/* eslint-disable prettier/prettier */
/* #️⃣22.2 File Upload part One
  1. File upload: 📃https://docs.nestjs.com/techniques/file-upload 


    🔹@Controller (path prefix): 경로접두사, 📃https://overcome-the-limits.tistory.com/590
    🔹@Get('hello')
    예시) @Contoller('app')  ✅http://localhost:3000/app/
          export class AppController {
            construct(private readonly appService: AppService){}
            @Get('/hello') ✅http://localhost:3000/app/hello
            getHello(): string {
              retun this.appService.getHello();
              
            }
          }

  2. [Insomnia]
    2-1)  POST | http://localhost:4000/uploads
    2-2)  [STRUCTURED] - [ Multipart Form] 선택 
          
         🔹[Body] - Content-Type : multipart/form-data 
          - 모든 문자를 인코딩하지 않음을 명시
          - 이 방식은  파일이나 이미지를 서버로 전송할 때 주로 사용           
          - 클라이언트가 요청을 보낼 때, http 프로토콜의 바디 부분에 데이터를 여러 부분으로 나눠서 보냄
           > 사진 파일은 image/jpeg 두 종류 > HTTP Request Body에 들어가야 한다
    
    2-3)(FileInterceptor('file')  @Param: fieldName 
    2-4) Send  ✅201Created
    {
      fieldname: 'file',
      originalname: 'SAM_0828.JPG',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: <Buffer ff d8 ff e1 f5 de 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 0b 01 0e 00 02 00 00 00 0c 00 00 00 92 01 
      0f 00 02 00 00 00 08 00 00 00 a8 01 10 00 02 ... 5605902 more bytes>,
      size: 5605952
    }
    2-5) AWS(Amazon Web Service) 또는 '크라우드'에 업로드할 수도 있다 

   #️⃣22.3 File Upload part Two 
   1. 📃npm install aws-sdk
      📃import * as AWS from "aws-sdk";   - 자체적으로 typescript definition이 함께 재공된다 
      🔷 S3은 AWS의 storage service  
        🔹SDK: Software Development Kit

  2. AWS 계정 만들기 
    - id/email: ceoosm@naver.com
    - 별칭: ohsoomansour
    - 루트 사용자 암호: je t'aime@34
      https://us-east-1.console.aws.amazon.com/iamv2/home#/users
      > 사용자 추가 > 사용자 이름: nestUpload 
      > 엑세스 키 - 프로그래밍 방식 엑세스  ✅액세스 키 – 프로그래밍 방식 액세스
       *AWS API, SDK에 대해 access key 및 secret access key를 활성화 = "AWS와 통신하는 서버를 연결 "
      > 기존 정책 직접 연결: 'S3검색' >  AmazonS3FullAccess > 권한 경계 없이 user 생성 
      > (태그 추가 생략)
      > [사용자 추가] ● 사용자 이름: nestUpload,
                     ● AWS 엑세스 유형: 프로그래밍 방식 엑세스(엑세스 키 사용)
                     ● 권한경계: 설정X 
      > 엑세스 키 ID: AKIAVXZM3DPMLTBQKKHD
      > 비밀 엑세스 키: o3rASJ6IJk6dBSHPEljgudMnExoyt7iwO7eLac2L (🚨까먹으면 새로 만들어야 함)
  
  3. AWS 설정 -  
    SDK의 구성
  📃글로벌 구성 설정:https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/global-config-object.html
  📃https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/setting-region.html   
   - AWS.Config 에서 region & 자격증명을 설정(필수)
     
     🔹SDK:Software Development Kit 
     🔹credentials: 서비스 및 리소스에 대한 액세스 권한을 결정하는 데 사용되는 인증 자격 증명을 지정
     🔹region: 서비스에 대한 요청이 이루어질 리전을 지정합니다.
     🔹update: 현재 구성을 새 값으로 업데이트 
     
  4. [bucket을 생성]
     async uploadFile(@UploadedFile() file) {

      AWS.config.update({
        region:'ap-northeast-2',
        credentials:{
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey:  process.env.AWS_ACCESS_SECRET_KEY,
        }
      })
      try {
        const upload = await new AWS.S3()✅.createBucket({
          Bucket: 'samsungnubereats' 🚨대문자x
        }).promise()
        console.log(upload);
        console.log(file)
      } catch {}
     }

    ⚡Insomnia: SEND
     { Location: 'http://samsungnubereats.s3.amazonaws.com/' }
     {
       fieldname: 'file',
       originalname: 'SAM_0828.JPG',
       encoding: '7bit',
       mimetype: 'image/jpeg',
       buffer: <Buffer ff d8 ff e1 f5 de 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 0b 01 0e 00 02 00 00 00 0c 00 00 00 92 01 
       0f 00 02 00 00 00 08 00 00 00 a8 01 10 00 02 ... 5605902 more bytes>,
       size: 5605952
     }
     🔹Buffer: 임시 저장 공간, A와 B가 서로 입출력을 수행하는데에 있어서 속도차이를 극복하기 위해 
       사용하는 임시 저장 공간 + byte 형식의 파일 

  5. [업로드 - putObject] 
   🔹putObject: "Adds an object to a bucket" 
       📄https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
   🔹미리 제공된 ACL(AccessControllList): 엑세세를 허용할 AWS 계정이나 그룹과 엑세스 유형을 정의
     - 📄https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/acl-overview.html
     - 'public-read': FULL_CONTROL을 가진다. AllUsers그룹(전세계 누구나)은 READ 액세스 권한을 가진다
       *부여할 수 있는 권한 - FULL_CONTROL: 피부여자에게 버킷에 대한 WRITE, READ, READ_ACP, WRIT_ACP 권한을 허용
      
  6.[bucket 확인]
   https://s3.console.aws.amazon.com/s3/buckets/samsungnubereats?region=ap-northeast-2&tab=objects
    
  7. Permission: "파일이 업로드되는 순간에 즉시 permission을 바꾸는 거다" 
    .putObject({
      ACL: 'public-read'
    })  
  8. [Insomnia]  POST | http://localhost:4000/uploads


  🚧데코레이터 함수 반환 유형 'void | TypedPropertyDescriptor<unknown>'은(는) 
    'void | TypedPropertyDescriptor<(file: any) => Promise<{ Url: string; }>>' 유형에 할당할 수 없습니다.🚧
  
   🔹Routing:특정 엔드 포인트(URL요청)에 대한 클라이언트 요청에 '서버가 응답하는 방법'을 결정하는 것
     
         
   🔹라우팅 헨들러: ✅콜백 
    [node.js]
    import express from "express"
    const app = express()
    app.get("/", ✅(req, res) => {
      res.send("You are Creazy! ")
    })

    📄https://docs.nestjs.com/techniques/file-upload#basic-example
    🔵To upload a single file, simply tie 🔹the FileInteceptor() interceptor to the route handler and 
      extract file from the request using 🔹the @UploadedFile() decorator.  

      @Post('upload')
      @UsueIntercepter(FileInterceptor('file'))
      uploadFile(@UploadedFile()file ) {
        console.log(file)
      }

    */
 
     
  
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as AWS from "aws-sdk";
import { ConfigService } from "@nestjs/config";
import * as S3 from 'aws-sdk/clients/s3';   

const BUCKET_NAME = 'samsungnubereats' 

@Controller('uploads')
export class UploadsController {
  constructor(private configService: ConfigService){}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))  
  async uploadFile(@UploadedFile() file) {

    AWS.config.update({
      region:'ap-northeast-2',
      credentials:{
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey:this.configService.get('AWS_ACCESS_SECRET_KEY'),
      }
    })
    try {
      const objectName = `${Date.now() + file.originalname}`
      const regionName = 'ap-northeast-2'
       await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        }).promise()
      const url = `https://${BUCKET_NAME}.s3.${regionName}.amazonaws.com/${objectName}`
      return { url }

    } catch(e) {
      return null; 
    }
  }
}


