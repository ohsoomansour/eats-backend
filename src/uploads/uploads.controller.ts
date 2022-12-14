/* eslint-disable prettier/prettier */
/* #๏ธโฃ22.2 File Upload part One
  1. File upload: ๐https://docs.nestjs.com/techniques/file-upload 


    ๐น@Controller (path prefix): ๊ฒฝ๋ก์ ๋์ฌ, ๐https://overcome-the-limits.tistory.com/590
    ๐น@Get('hello')
    ์์) @Contoller('app')  โhttp://localhost:3000/app/
          export class AppController {
            construct(private readonly appService: AppService){}
            @Get('/hello') โhttp://localhost:3000/app/hello
            getHello(): string {
              retun this.appService.getHello();
              
            }
          }

  2. [Insomnia]
    2-1)  POST | http://localhost:4000/uploads
    2-2)  [STRUCTURED] - [ Multipart Form] ์ ํ 
          
         ๐น[Body] - Content-Type : multipart/form-data 
          - ๋ชจ๋  ๋ฌธ์๋ฅผ ์ธ์ฝ๋ฉํ์ง ์์์ ๋ช์
          - ์ด ๋ฐฉ์์  ํ์ผ์ด๋ ์ด๋ฏธ์ง๋ฅผ ์๋ฒ๋ก ์ ์กํ  ๋ ์ฃผ๋ก ์ฌ์ฉ           
          - ํด๋ผ์ด์ธํธ๊ฐ ์์ฒญ์ ๋ณด๋ผ ๋, http ํ๋กํ ์ฝ์ ๋ฐ๋ ๋ถ๋ถ์ ๋ฐ์ดํฐ๋ฅผ ์ฌ๋ฌ ๋ถ๋ถ์ผ๋ก ๋๋ ์ ๋ณด๋
           > ์ฌ์ง ํ์ผ์ image/jpeg ๋ ์ข๋ฅ > HTTP Request Body์ ๋ค์ด๊ฐ์ผ ํ๋ค
    
    2-3)(FileInterceptor('file')  @Param: fieldName 
    2-4) Send  โ201Created
    {
      fieldname: 'file',
      originalname: 'SAM_0828.JPG',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: <Buffer ff d8 ff e1 f5 de 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 0b 01 0e 00 02 00 00 00 0c 00 00 00 92 01 
      0f 00 02 00 00 00 08 00 00 00 a8 01 10 00 02 ... 5605902 more bytes>,
      size: 5605952
    }
    2-5) AWS(Amazon Web Service) ๋๋ 'ํฌ๋ผ์ฐ๋'์ ์๋ก๋ํ  ์๋ ์๋ค 

   #๏ธโฃ22.3 File Upload part Two 
   1. ๐npm install aws-sdk
      ๐import * as AWS from "aws-sdk";   - ์์ฒด์ ์ผ๋ก typescript definition์ด ํจ๊ป ์ฌ๊ณต๋๋ค 
      ๐ท S3์ AWS์ storage service  
        ๐นSDK: Software Development Kit

  2. AWS ๊ณ์  ๋ง๋ค๊ธฐ 
    - id/email: ceoosm@naver.com
    - ๋ณ์นญ: ohsoomansour
    - ๋ฃจํธ ์ฌ์ฉ์ ์ํธ: je t'aime@34
      https://us-east-1.console.aws.amazon.com/iamv2/home#/users
      > ์ฌ์ฉ์ ์ถ๊ฐ > ์ฌ์ฉ์ ์ด๋ฆ: nestUpload 
      > ์์ธ์ค ํค - ํ๋ก๊ทธ๋๋ฐ ๋ฐฉ์ ์์ธ์ค  โ์ก์ธ์ค ํค โ ํ๋ก๊ทธ๋๋ฐ ๋ฐฉ์ ์ก์ธ์ค
       *AWS API, SDK์ ๋ํด access key ๋ฐ secret access key๋ฅผ ํ์ฑํ = "AWS์ ํต์ ํ๋ ์๋ฒ๋ฅผ ์ฐ๊ฒฐ "
      > ๊ธฐ์กด ์ ์ฑ ์ง์  ์ฐ๊ฒฐ: 'S3๊ฒ์' >  AmazonS3FullAccess > ๊ถํ ๊ฒฝ๊ณ ์์ด user ์์ฑ 
      > (ํ๊ทธ ์ถ๊ฐ ์๋ต)
      > [์ฌ์ฉ์ ์ถ๊ฐ] โ ์ฌ์ฉ์ ์ด๋ฆ: nestUpload,
                     โ AWS ์์ธ์ค ์ ํ: ํ๋ก๊ทธ๋๋ฐ ๋ฐฉ์ ์์ธ์ค(์์ธ์ค ํค ์ฌ์ฉ)
                     โ ๊ถํ๊ฒฝ๊ณ: ์ค์ X 
      > ์์ธ์ค ํค ID: AKIAVXZM3DPMLTBQKKHD
      > ๋น๋ฐ ์์ธ์ค ํค: o3rASJ6IJk6dBSHPEljgudMnExoyt7iwO7eLac2L (๐จ๊น๋จน์ผ๋ฉด ์๋ก ๋ง๋ค์ด์ผ ํจ)
  
  3. AWS ์ค์  -  
    SDK์ ๊ตฌ์ฑ
  ๐๊ธ๋ก๋ฒ ๊ตฌ์ฑ ์ค์ :https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/global-config-object.html
  ๐https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/setting-region.html   
   - AWS.Config ์์ region & ์๊ฒฉ์ฆ๋ช์ ์ค์ (ํ์)
     
     ๐นSDK:Software Development Kit 
     ๐นcredentials: ์๋น์ค ๋ฐ ๋ฆฌ์์ค์ ๋ํ ์ก์ธ์ค ๊ถํ์ ๊ฒฐ์ ํ๋ ๋ฐ ์ฌ์ฉ๋๋ ์ธ์ฆ ์๊ฒฉ ์ฆ๋ช์ ์ง์ 
     ๐นregion: ์๋น์ค์ ๋ํ ์์ฒญ์ด ์ด๋ฃจ์ด์ง ๋ฆฌ์ ์ ์ง์ ํฉ๋๋ค.
     ๐นupdate: ํ์ฌ ๊ตฌ์ฑ์ ์ ๊ฐ์ผ๋ก ์๋ฐ์ดํธ 
     
  4. [bucket์ ์์ฑ]
     async uploadFile(@UploadedFile() file) {

      AWS.config.update({
        region:'ap-northeast-2',
        credentials:{
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey:  process.env.AWS_ACCESS_SECRET_KEY,
        }
      })
      try {
        const upload = await new AWS.S3()โ.createBucket({
          Bucket: 'samsungnubereats' ๐จ๋๋ฌธ์x
        }).promise()
        console.log(upload);
        console.log(file)
      } catch {}
     }

    โกInsomnia: SEND
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
     ๐นBuffer: ์์ ์ ์ฅ ๊ณต๊ฐ, A์ B๊ฐ ์๋ก ์์ถ๋ ฅ์ ์ํํ๋๋ฐ์ ์์ด์ ์๋์ฐจ์ด๋ฅผ ๊ทน๋ณตํ๊ธฐ ์ํด 
       ์ฌ์ฉํ๋ ์์ ์ ์ฅ ๊ณต๊ฐ + byte ํ์์ ํ์ผ 

  5. [์๋ก๋ - putObject] 
   ๐นputObject: "Adds an object to a bucket" 
       ๐https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
   ๐น๋ฏธ๋ฆฌ ์ ๊ณต๋ ACL(AccessControllList): ์์ธ์ธ๋ฅผ ํ์ฉํ  AWS ๊ณ์ ์ด๋ ๊ทธ๋ฃน๊ณผ ์์ธ์ค ์ ํ์ ์ ์
     - ๐https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/acl-overview.html
     - 'public-read': FULL_CONTROL์ ๊ฐ์ง๋ค. AllUsers๊ทธ๋ฃน(์ ์ธ๊ณ ๋๊ตฌ๋)์ READ ์ก์ธ์ค ๊ถํ์ ๊ฐ์ง๋ค
       *๋ถ์ฌํ  ์ ์๋ ๊ถํ - FULL_CONTROL: ํผ๋ถ์ฌ์์๊ฒ ๋ฒํท์ ๋ํ WRITE, READ, READ_ACP, WRIT_ACP ๊ถํ์ ํ์ฉ
      
  6.[bucket ํ์ธ]
   https://s3.console.aws.amazon.com/s3/buckets/samsungnubereats?region=ap-northeast-2&tab=objects
    
  7. Permission: "ํ์ผ์ด ์๋ก๋๋๋ ์๊ฐ์ ์ฆ์ permission์ ๋ฐ๊พธ๋ ๊ฑฐ๋ค" 
    .putObject({
      ACL: 'public-read'
    })  
  8. [Insomnia]  POST | http://localhost:4000/uploads


  ๐ง๋ฐ์ฝ๋ ์ดํฐ ํจ์ ๋ฐํ ์ ํ 'void | TypedPropertyDescriptor<unknown>'์(๋) 
    'void | TypedPropertyDescriptor<(file: any) => Promise<{ Url: string; }>>' ์ ํ์ ํ ๋นํ  ์ ์์ต๋๋ค.๐ง
  
   ๐นRouting:ํน์  ์๋ ํฌ์ธํธ(URL์์ฒญ)์ ๋ํ ํด๋ผ์ด์ธํธ ์์ฒญ์ '์๋ฒ๊ฐ ์๋ตํ๋ ๋ฐฉ๋ฒ'์ ๊ฒฐ์ ํ๋ ๊ฒ
     
         
   ๐น๋ผ์ฐํ ํจ๋ค๋ฌ: โ์ฝ๋ฐฑ 
    [node.js]
    import express from "express"
    const app = express()
    app.get("/", โ(req, res) => {
      res.send("You are Creazy! ")
    })

    ๐https://docs.nestjs.com/techniques/file-upload#basic-example
    ๐ตTo upload a single file, simply tie ๐นthe FileInteceptor() interceptor to the route handler and 
      extract file from the request using ๐นthe @UploadedFile() decorator.  

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


