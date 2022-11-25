/*#️⃣26.0 Heroku Setup
<git 처리 과정> - ※https://jforj.tistory.com/119
  1.> Working Directory: 개발자의 현재시점으로 소스코드를 수정하며 개발하는 공간을 의미
    > Staging Area: Working Directory에서 작업한 파일을 Local Repository에 전달하기 위해 파일들을 분류하는 공간
    > Local Repository: 로컬 저장소이며 작업한 파일들을 저장해두는 내부 저장소(.git 폴더)
    > Remote Repository: 원격 저장소이며 인터넷으로 연결되어 있어 있는 외부 저장소
    *Branch: Remote Repository의 현재 상태를 복사하며 master 브랜치와 별개의 작업을 진행할 수 있는 공간
             보통 브랜치를 생성하여 개발을 진행하고 개발을 완료하면 master 브랜치에 병합하여 개발 완료된 소스코드를 합침
    *Head: 현재 작업중인 브랜치의 최근 커밋된 위치
    *index: Staging Area를 의미           

  git init
  git add README.md  
    - git add: 어떤 파일을 깃에 올릴지 함 보쟈, git add . 프로젝트 모든 파일을 추가 하겠다  
    - 🔧🚀"수정된 소스코드들을 > Staging Area로 전달"🚀
    - git add index.html (index.html만 올리겠다)
  git status : 📜📄내가 올릴려고 하는 파일들 나열📃  
    -  WorkingDirectory에서 📂수정이 발생된 파일들📂을 확인
  git commit -m "first commit" 
    - 최종본이라고 볼 수있음
    - (add된 모든 소코드들을)🚀Staging Area > Local Repositiory로 이동🚀   
  git branch -M main
    - main branch는 '배포 가능한 상태'만 관리 
    - 생성되어 있는 브랜치를 확인
  git remote add origin https://github.com/ohsoomansour/eats-backend.git(리포리토리주소) 
   - origin은 git이 가져온 '원격 저장소'를 가리킴
     > 🚀 원격 저장소를 연결 🪐🌍
  git remote -v
   -  내가 설정해둔 원격저장소 이름과 URL을 확인 할 수 있음 
  git push -u origin main : "master - > master 성공" 
   - orgin:원격저장소 별칭 d
   - master: 현재브랜치 이름 
   - 🚀'로컬 저장소'에서 파일을 업로드하면서🚀 병합시키는 명령어가 push🚩 

  
  ★수정발생: 
    git add . (전체하는게 편함 )
    git commit -m "second commit" 
    git remote -v : 내가 설정해둔 원격저장소 이름과 URL을 확인 할 수 있음 
    git remote add origin https://github.com/ohsoomansour/CodeChallenge5_revised1.git > error: remote origin already exists.
    > git remote rm origin: "🚧연결이 잘못되었으면 연결을 해제함🚧"
    git push -u origin main
    > 수정커밋하고 나서 재배포 해야함 npm run deploy
    > 변한 게 없다 싶으면 Ctrl + Shift + R로 캐쉬를 무시하는 '새로고침'을 하면 됩니다.
    ❗if) "first commit" 최종본을 해버린 상태면 local repository로 보내버린 상태, 즉 1차 준비 끝이라는 뜻임
        따라서 'push'로 보내버리고  수정 "second commit"으로 처리하면 됨  

  ★gh-pages
  ⓵npm install gh-pages --save-dev
  ⓶"scripts": {"deploy": "gh-pages -d build", "predeploy": "npm run build" }
    "homepage": "https://ohsoomansour.github.io/CodeChallenge1/" 
  ⓷npm run build > npm run deploy (published 성공!)
  🚨에러 발생 대처🚨
  1.warning: LF will be replaced by CRLF in src/App.tsx.
  The file will have its original line endings in your working directory
  ocrlf true
  *LF:줄을 바꾸려는 동작 
  *CRLF:줄 바꿈
  > 💊해결 한 방: git config --global core.autocrlf true

  🔥github.com/search?q=user%3Asoo-sin   


                                                Heroku 
  1. 📄Heroku Home:https://dashboard.heroku.com/new-app 
      > ID:ceoosm@naver.com /PW: je t'aime@34
      > App name: eats-backend
      >  npm install -g heroku
  2. [1단계]
     📄The Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
     > npx heroku --version > ⚡heroku/7.66.4 win32-x64 node-v17.6.0
     > npx heroku login
     [2단계]
     🚨Create new Git repository
     > cd nuber-eats-backend(파일이름)
     > git init
     > npx heroku git:remote -a eats-backend(프로젝트 이름) > ⚡set git remote heroku to https://git.heroku.com/eats-backend.git
   
  
  3. 커밋  
    git add .
    git commit -am "make it better"
    git push heroku main(master)    "커밋 한 것을 모두 heroku에 푸시 " 
    🔴error: src refspec master does not match any
    🔵의존성 문제 해결 
     🚨node version 17.6.0 > 18.12.1..
      📄nvm 설치&관리: https://github.com/coreybutler/nvm-windows/releases
      > ⭐nvm 추천 
       📄https://github.com/nvm-sh/nvm/blob/master/README.md 
        
        
       > 대안: (수동)npm 18.12.1 LTS(안정적, 신뢰도 높음)✅
       
     🚨 npm version 8.19.3 vs using default version:8.19.2
      
        
     🚨 peer typeorm@"^0.3.0" from @nestjs/typeorm@9.0.1
      > ✅[package-lock.json]
        "peerDependencies":{
          "node_modules/typeorm": {
            "version": "0.3.0"
          }
        }
      > typeorm 0.3.1 ---> 0.3.0  > npm uninstall typeorm && npm install typeorm@3.0.0 
      > 버전확인: npx typeorm -v
   
      > 🔴typeorm version 0.3.0 ~  find option 문제 
        🔵📄https://typeorm.io/find-options
          - 0.2.45: 버전: findOne(id) 가능 
          - 0.3.0~ 버전:  findOne(), findOne(id) signature
 
      
      

    🔵 추가적 참고 
       > git checkout -b main > git branch -D master
       > heroku plugins:install heroku-repo
       > npx heroku repo-reset -a eats-backend(appname)     

    🔹Git Bash: window의 cmd, linux와 mac의 terminal과 같은 역할   

 4.    git push heroku main(master)    "커밋 한 것을 모두 heroku에 푸시 " 
    > [Released v3]
    > remote:https://eats-backend.herokuapp.com/ deployed to Heroku > "클릭 확인" > "App --> heroku 감"  
    > 🚨An error occurred in the application and your page could not be served
        if you are the application owner, check your logs for details 
                      ⚡npx heroku logs --tail  (tail은 실시간 로그인)

    > 🚨Error 발생,  nuber-eats-backend@0.0.1 start "application 명령어를 실행하려고 시도 했는데,       🚫실행을 못 함"   
    > 🔴Error: spawn nest ENOENT
      🔹ENOENT = Error NO ENTry  

  5. 🚧 에러 해결 🚧
    Q.우리는 어떻게 heroku deployment를 configure 할 수 있을까 ?
    - heroku는 서버를 실제 연결할 필요 업도록 디자인
    - deploy 전에 configure만 해주면 된다!
    🅰[package.json] - #26.0 Heroku Setup 09:30 ~
      [기존]
      "script":{
        "start":"cross-env NODE_ENV=prod nest start", 
      } 
      [변경]
       "script":{
        "start:prod": "cross-env NODE_ENV=prod nest start", 
        } 

    🅰 Heroku를 Configure > Procfile 파일 생성 > Heroku는 Procfile에 자동으로 보여질 예정
    > 📃https://devcenter.heroku.com/articles/procfile
    > [Procfile format]
      <process type>: <command>    --- [Procfile 파일] ⚡web: npm run start:prod
    > git add . > git commit -am "Procfile" > git push heroku main
                    ⚡Discovering process types 
                      Procfile declares types -> Web                  
                    ⚡npm run start:prod (실행이 보임❗)

  6. port environment
    [main.ts] - app.listen(4000) Heroku에 있는 port는 사실 port:4000이 아니다 
    > 몇 가지 변경 필요! > Heroku가 원하는 port에서 실행 하도록 만듬
    > remote:https://eats-backend.herokuapp.com/ deployed to Heroku
        ⚡npx heroku logs --tail  (tail은 실시간 로그인)

  7. 🚨npm ERR! LIFECYCLE   
 Error: Config validation error: 🚧"NODE_ENV" must be one of [dev, prod, test].🚧 "DB_HOST" is required. "DB_PORT" is required. "DB_USERNAME" is required. "DB_PASSWORD" is required. "DB_NAME" is required. "PRIVATE_KEY" is required. "MAILGUN_API_KEY" is required. "MAILGUN_DOMAIN_NAME" is required. "MALIGUN_FROM_EMAIL" is required. "AWS_ACCESS_KEY" is required. "AWS_ACCESS_SECRET_KEY" is required
 
                        🅰NODE_ENV를 production 으로 설정
    [environment variables]
  > npx heroku (명령어 확인)
  > USAGE : $ heroku [COMMAND]
    TOPICS 
      config - environment variables of apps   
  > npx heroku config
    ⚡=== eats-backend Config Vars   "어떤 config도 가지지 않음 " 
  > npx heroku config --help
  > npx heroku config:set --help
    
      npx heroku config:set NODE_ENV=prod
    🚨+ CategoryInfo : 보안 오류: (:) [], PSSecurityException
      + FullyQualifiedErrorId : UnauthorizedAccess
    💊명령 프롬프트 관리자 권한으로 실행: cd 현재위치 > heroku config:set NODE_ENV=production  

 8. Find more add-ons
   > Postgres sql을 Heroku에서 관리할 수 있게 해준다
   > Heroku Postgres > Install Heroku Postgres > basic $9 추천
   > https://dashboard.heroku.com/apps/eats-backend/resources?justInstalledAddonServiceId=6c67493d-8fc2-4cd4-9161-4f1ec11cbe69
   > ⭐Heroku는 Amazon AWS에서 동작 
    - Host: ec2-44-205-177-160.compute-1.amazonaws.com
    - Database: de87e1g70u93f0
    - User: fmurhuqrvxzrno
    - Port: 5432
    - Password: 9c213ad231341d9791427657a244b1fd3fbb17c12175bc44ac9dc394f1c138c7
    - postgres://fmurhuqrvxzrno:9c213ad231341d9791427657a244b1fd3fbb17c12175bc44ac9dc394f1c138c7@ec2-44-205-177-160.compute-1.amazonaws.com:5432/de87e1g70u93f0
    - Heroku CLI: heroku pg:psql postgresql-clear-18708 --app eats-backend

  > PRIVATE_KEY: 📃randomkeygen.com, jwt 암호화를 위해 
    - CodeIgniter Encryption Keys - Can be used for any other 256-bit key requirement.
    - gEf9Trma7IDBisJDOjHhmR5QsPZcVuvu
    🔹dynos = application   
     
    🚨no pg_hba.conf entry for host "3.83.120.195", user "fmurhuqrvxzrno", database "de87e1g70u93f0", no encryption🚨
    🔵heroku config:set PGSSLMODE=no-verify

  9. 🚨Web process failed to bind to $PORT within 60 seconds of launch🚨 
    > "만약 web이 '제공된 port'로 연결하지 않으면 60초 안에 실패 할 수있다 "  
    > Heroku는 port4000을 열지 않고 다른 port를 열 수도 있다
    > [main.ts]
    🔵await app.listen(process.env.PORT || 4000)    
      > process.env.PORT는 "Heroku에 있는 포트를 listen하면 된다!" 
      > application을 컴퓨터에서 시작했을 때, 내 컴퓨터는 4000에 연결 + Heroku에서는 PORT 환경 변수를 가져옴
      > git add . > git commit -am "PORT" > git push heroku main

   #️⃣26.2 Heroku Conclusion
    1. 🚨Skipping because NODE_ENV is not 'production'
      > [app.modules.ts]
        validationSchema: Joi.object({
          NODE_ENV: Joi.string()
            .valid('dev', 'production', 'test')
            .required(),
        })

      > https://dashboard.heroku.com/apps/eats-backend/settings > NODE_ENV=production

    2. State changed from starting to crashed
      >  ⚡State changed from up to starting
        🚧QueryFailedError: relation "restaurant" does not exist🚧
          추측1.  
           TypeOrmModule.forRoot({
              synchronize: ❗process.env.NODE_ENV !== 'production',  >> true
            })

        ⚡(변경 후) git add . > git commit -am "QueryFailedError" > git push heroku main
             

      🚫503 에러: 서버가 요청을 처리할 준비가 되지 않음을 나타냄 새로 배포된 클라우드 서비스 app이
                  갑자기 이 오류를 throw하기 시작한 이유를 고려해야 한다
                  "현재 웹 사이트의 서버를 사용할 수 없다는 것"
      > https://eats-backend.herokuapp.com/  ⚡Not Found 404
      > https://eats-backend.herokuapp.com/graphql     

     3. 🚨Idleing - State changed from up to down + Process exited with status 143
        > https://eats-backend.herokuapp.com/ > https://eats-backend.herokuapp.com/graphql
    
 #️⃣26.2 Heroku Conclusion
    1. GraphQLModule.forRoot({
      introspection: true,
      playground: process.env.NODE_ENV !== 'production',  🚫배포 상태에서 playground 금지!

    }),    

    2. [Deployment method] - GitHub 선택 후 > github repository 연결 > git push -u origin main

    3. 🚨please note that these credentials are not permanent
      > https://data.heroku.com/datastores/620c7e16-05f7-4e1b-96a6-b7dad2fa90dc#administration > view credentials
      > 🔵해결책: 하나의 환경변수를 감지하도록 만들어 주면 된다  
      > postgres://fmurhuqrvxzrno:9c213ad231341d9791427657a244b1fd3fbb17c12175bc44ac9dc394f1c138c7@ec2-44-205-177-160.compute-1.amazonaws.com:5432/de87e1g70u93f0   (listen❗)

     > https://dashboard.heroku.com/apps/eats-backend/activity
      'DATABASE_URL'이 우리가 감지하고자 하는 환경 변수의 이름값 
     > TypeOrmModule.forRoot({
        ...(process.env.DATABASE_URL
          ? { url: process.env.DATABASE_URL}  ---heroku가 제공하는 DATABASE_URL ---
          : {
              host:process.env.DB_HOST,
              host: process.env.DB_HOST,
              port: +process.env.DB_PORT,
              username: process.env.DB_USERNAME,       --- (로컬 환경) ---
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
            }
        )

       })   
      > configModule에서 DB_HOST등 외 4 환경 변수는 required가 아님 
        - 이유는 heroku DB에서는 더 이상 찾아 볼 수 없음
        - Local에서의 '환경 변수'에만 해당 

    4. 🚨Process exited with status 1 
       - 이유: 접속이 끊김 따라서 배포 해주면 다시 살아남
         > 근본적인 대책: I'll have to pay for the dyno to stay up 
       📃https://devcenter.heroku.com/articles/error-codes#h10-app-crashed
   5. error: RPC failed; curl 56 OpenSSL SSL_read: Connection was reset, errno 10054

   6.📄postgreql 사용법: https://devcenter.heroku.com/articles/dataclips
    - SELECT * FROM (테이블명)        