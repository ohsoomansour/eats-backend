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
  1. 📄Heroku Home:https://dashboard.heroku.com/new-app id:ceoosm@naver.com /pw: je t'aime@34
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
        > npm install nvm
        >  명령 프롬프트  > 관리자 권한 실행 >커맨드 프로그램을 관리자 권한(administrative rights) 
        > C:\WINDOWS\system32> node -v 
        > v19.1.0
        
       > 대안: (수동)npm 18.12.1 LTS(안정적, 신뢰도 높음)✅
     

      
      

     🚨 npm versino 8.19.3 vs using default version:8.19.2

     🚨 peer typeorm@"^0.3.0" from @nestjs/typeorm@9.0.1
      > npx typeorm 0.3.1 
      > npm i typeorm@0.3.0
      > 버전확인: npx typeorm -v

      > 🔴typeorm version 0.3.0 ~  find option 문제 
          📄https://typeorm.io/find-options
          - 0.2.45: 버전: findOne(id) 가능 
 
      > [package-lock.json]
      "peerDependencies":{
        "node_modules/typeorm": {
          "version": "0.3.0"
        }
      }  
      
         
      [질문사항]
      1. @nestjs/typeorm 있어서 별도로 npm i typeorm 하면 안되는 건가 ? 
        > 그렇게 되면 @0.3.1 버전을 또 ㄲ설치하는 건가 

    🔵 추가적 확인 
       > git checkout -b main > git branch -D master
       > heroku plugins:install heroku-repo
       > npx heroku repo-reset -a eats-backend(appname)     

  🔹Git Bash: window의 cmd, linux와 mac의 terminal과 같은 역할   