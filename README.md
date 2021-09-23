<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-blue.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<p align="center">
<img width="100%" alt="CAPIN-ppt" src="https://user-images.githubusercontent.com/42789819/125911405-77e66383-5733-4bc3-847c-0b951ba8ed56.png">
</p>

<br>

# <img width=40px src=https://user-images.githubusercontent.com/42789819/124378687-b7909d80-dced-11eb-8395-dd88da969f35.png> Project
**오늘도 '카페 어디가지?' 고민하는 분들을 위한 카페맵 앱 서비스 / [Service OPR](https://www.notion.so/O-P-R-f521f789248347949bef26a1ef0d2354#2f8521e618114579b183cdcd99188d2f)**  
> **Team-CA:PIN Server**  
> SOPT 28th APPJAM  
> 프로젝트 기간: 2021.06.26 ~ 2021.07.16

<br>

###  **CA:PIN** Server Developers / Our CAFETI

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/seu11ee"><img src="https://capin.s3.ap-northeast-2.amazonaws.com/cafeti/giraffe_coffee%402x.png" width="200px;" alt=""/><br />CXVB</br><sub><b>seu11ee</b></sub></a></br><a href="https://github.com/teamCA-PIN/CA-PIN_Server/commits?author=seu11ee" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/snowedev"><img src="https://user-images.githubusercontent.com/42789819/125914896-cb895905-4552-4306-b297-2af84bfb3765.png" width="200px;" alt=""/><br />NJMB</br><sub><b>snowedev</b></sub></a><br /><a href="https://github.com/teamCA-PIN/CA-PIN_Server/commits?author=snowedev" title="Code">💻</a></td>
  </tr>
</table>

<br>

### We used
<p align="left">

![TypeScript](https://img.shields.io/badge/typescript-4.2.3-blue) ![ts-node](https://img.shields.io/badge/ts_node-9.1.1-deepgreen) ![aws](https://img.shields.io/badge/aws-ec2,s3-orange) ![mongoose](https://img.shields.io/badge/mongoose-5.10.4-green)
</p>

<br>

### Dependencies module (package.json)
#### <kbd>Dev module:</kbd> 
```json
      "devDependencies": {
        "@types/bcryptjs": "^2.4.2",
        "@types/express": "^4.17.11",
        "@types/mongoose": "^5.10.4",
        "@types/node": "^14.14.37",
        "nodemon": "^2.0.7",
        "ts-node": "^9.1.1",
        "typescript": "^4.2.3"
      }
```

#### <kbd>module:</kbd>
```json
    "dependencies": {
        "@types/aws-sdk": "^2.7.0",
        "@types/http-errors": "^1.8.1",
        "@types/morgan": "^1.9.3",
        "@types/multer": "^1.4.7",
        "@types/winston": "^2.4.4",
        "axios": "^0.21.1",
        "bcryptjs": "^2.4.3",
        "dotenv": "^8.2.0",
        "express": "^4.17.1",
        "express-validator": "^6.10.0",
        "global": "^4.4.0",
        "jsonwebtoken": "^8.5.1",
        "mongoose": "^5.12.3",
        "morgan": "^1.10.0",
        "multer": "^1.4.2",
        "multer-s3": "^2.9.0",
        "nodemailer": "^6.6.2",
        "request": "^2.88.2",
        "winston": "^3.3.3",
        "winston-daily-rotate-file": "^4.5.5"
      }
```

<br>

###  Server Architecture
<img width=100% src=https://user-images.githubusercontent.com/42789819/125916983-65289f69-13f4-4cc5-98d0-b442c853898a.png>  

<br>

###  API doc / Task
> **[CA:PIN API Documents](https://www.notion.so/793451f945b0494fa8c4117d5e3c34e8?v=c2b16a0f8c044bab80ff9ce509af21cd)**

<br>

 ### Coding Convention
 > [Coding Convention 자세히 보기](https://github.com/teamCA-PIN/CA-PIN_Server/wiki)
 >
 > 다음 스타일 Guide를 참고헀습니다. 👉🏻[Airbnb Style Guide](https://github.com/tipjs/javascript-style-guide)
 <details>
 <summary> <kbd>🗂 폴더구조</kbd> </summary>
 <div markdown="1">  

---

```bash
src
│   index.ts        # App entry point
└───api             # Express route controllers for all the endpoints of the app
└───config          # Environment variables and configuration related stuff
└───interfaces      # All the interfaces is here
└───loaders         # Split the startup process into modules
└───middleware      # auth.ts
└───models          # Database models
└───services        # All the business logic is here
```

<br>
 </div>
 </details>
 

<details>
<summary> <kbd>🖋 네이밍</kbd> </summary>
<div markdown="1">       

---

- 변수, 함수, 인스턴스는 *Camel Case(=lower 카멜 케이스)*를 사용한다.

    ex) camelCase

- 함수의 경우 동사+명사 형태로 구성한다.

    ex) getUserInfomation()

- Class, Contructor는 *Pascal Case(=upper 카멜 케이스)*를 사용한다.

    ex) CamelCase

- 글자의 길이
    - 글자의 길이는 20자 이내로 제한한다.
    - 4단어 이상이 들어가거나, 부득이하게 20자 이상이 되는 경우 팀원과의 상의를 거친다.
- flag로 사용되는 변수
    - Boolean의 경우 조동사+flag 종류로 구성된다. ex) isNum, hasNum
- 약칭의 사용
    - 약어는 되도록 사용하지 않는다.
    - 부득이하게 약어가 필요하다고 판단되는 경우 팀원과의 상의를 거친다.
        ```jsx
        let idx; // bad
        let index; // good

        let cnt; // bad
        let count; // good

        let arr; // bad
        let array; // good

        let seoul2Bucheon; // bad
        let seoulToBucheon; // good
        ```
<br>

</div>
</details>
 
 
 
 <details>
 <summary> <kbd>🏷 주석</kbd> </summary>
 <div markdown="1">       
 
 ---

한줄은 //로 적고, 그 이상은 /** */로 적는다.

```jsx
// 한줄 주석일 때
/**
 * 여러줄
 * 주석일 때
 */
```

함수에 대한 주석

- backend에서 공통적으로 사용하는 함수의 경우, 모듈화를 통해 하나의 파일로 관리한다.
- 하나의 파일의 시작 부분에 주석으로 상세 내용을 작성한다.
    - **함수의 전체 기능**에 대한 설명
    - **함수의 파라미터**에 대한 설명 (type: ..., 역할)
    - router 또는 api일 때에는 성공 여부도 적어준다.
    - 예시 코드
        ```jsx
        /**
         * @api {get} /study/:roomNumber/questions?sort_by=created&order_by=asc 방의 질문 목록을 가져옴
        * @apiName GetQuestions
        * @apiGroup Question
        *
        * @apiParam {String} roomNumber 유일한 방 번호
        *
        * @apiSuccess {Boolean} success API 호출 성공 여부
        * @apiSuccess {String} message 응답 메시지
        * @apiSuccess {Object} data 해당 방의 질문 리스트
        */
        router.get(
        "/study/:roomNumber/questions",
        [checkParamAndQuery("roomNumber").isNumeric()],
        getQuestions.default
        );
        ```
 </div>
 </details>

<br>

### Commit Messge Rules
<details>
<summary> <kbd>✉️ CA:PIN Server Git Commit Message Rules</kbd> </summary>
<div markdown="1">       

---
#### 📜 커밋 메시지 명령어 모음
> 반영사항을 바로 확인할 수 있도록 작은 기능 하나라도 구현되면 커밋을 권장합니다.

```
  - init : 초기화
  - feat : 기능 추가
  - update : 기능 보완 (업그레이드)
  - fix : 버그 수정
  - refactor: 리팩토링
  - style : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)
  - docs : 문서 (문서 추가(Add), 수정, 삭제)
  - test : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)
  - chore : 기타 변경사항 (빌드 스크립트 수정, 에셋 추가 등)
```
<br>

#### ℹ️ 커밋 메세지 형식
  - `[커밋메세지] 설명` 형식으로 커밋 메시지를 작성합니다.
  - 커밋 메시지는 영어 사용을 권장합니다.
    ```
    [feat] add user model
    ```
</div>
</details>
 
<br>

### Github mangement

<details>
<summary> <kbd>💻 CA:PIN Server Branch Strategy</kbd> </summary>
<div markdown="1">       

---

### 브랜치 전략

- main 브랜치 - 프로젝트 초기 셋팅
- dev 브랜치 - default branch로 설정
- 할 일 issue 등록 후 issue 번호로 브랜치 생성 후 작업
    - feature/#이슈넘버
- PR ➡️ 코드리뷰 ➡️ 머지( → dev)
- 머지 후 feature 브랜치 삭제
- 브랜치 생성 전 dev 최신화
- PR 전 tsc or yarn run build로 dist 업데이트 후 커밋

<br>

```
- main
- dev
- feature
   ├── #1
   ├── #2
   └── #3
```

<br>
</div>
</details>
  
<br>
