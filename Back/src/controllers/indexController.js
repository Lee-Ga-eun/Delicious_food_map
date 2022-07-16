const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");

const indexDao = require("../dao/indexDao");


/*
회원가입 api: createRegister
1.파라미터로 userId, nickname,password 받아오기, 
2.정규식을 통해 올바른지 1차 거르기, 
3.걸러진 것을 토대로 DB에 회원정보 입력
4. 토큰 만들기: jsonwebtoken, 
*/

exports.createRegister = async function(req,res){
  // 데이터 불러오기
  const {userID, password, nickname} = req.body; //req.body:JSON의 데이터를 담는다. 주소에선 확인 불가능하다
  // 아이디, 패스워드로 적합한지 검증하기 위한 검증식 생성
  const validate_userID= /^[a-z]+[a-z0-9]{5,19}$/; // 영문자로 시작하는 영문자 또는 숫자 6-20; 
  //const validate_password=/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/; //비밀번호 정규식 8-16 문자, 숫자 조합
  const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/;
  console.log({userID});
  //검증: test함수 사용 (true, false 반환함)
  if(!validate_userID.test(userID)){
    return res.send({
      isSuccess: false,
      code: 400,
      message: "아이디는 숫자와 영문만 입력 가능합니다",
    });
  }
  console.log("아이디 통과");
  if(!passwordRegExp.test(password)){
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "비밀번호 정규식 8-16 문자, 숫자 조합",
    });
  }
  console.log("비밀번호 통과?");
  

  //검증 끝. 통과한 객체들을 가지고 이제 DB에 입력한다. try문에 넣는다
  try{
    const connection = await pool.getConnection(async (conn) => conn); //db연결

    try{
      // DB입력.
      const [rows] = await indexDao.InsertUsers(connection, userID, password, nickname);
      console.log(rows);
      //rows에 insertId가 나왔다 치고, (row의 key값: 여기선 userIdx): 이걸 가지고 jwt를 만든다
      const userIdx=rows.insertId;
      //jwt 생성
      // sign(payload, 비밀키), payload엔 내가 데이터로 쓰고자 하는 것(비번은 빠진다 여기서),비밀키는 secret에 들어있다
      const token=jwt.sign(
        {userIdx:userIdx, nickname:nickname}, secret.jwtsecret
      );
      //try문 이제 끝내자!
      return res.send({
        result: {jwt:token},
        isSuccess:true,
        code:200,
        message:"회원가입 성공",
      })
    }catch(err){logger.error(`createUsers Query error\n: ${JSON.stringify(err)}`);
    return false;}finally{connection.release();}
  }catch(err){logger.error(`createUsers DB connection error\n: ${JSON.stringify(err)}`);
  return false;}
  
};

//***************** *********************/
// 로그인 api
exports.AccessLogin = async function(req,res){
  /*
  request로 회원가입 정보를 받아온다
  잘 넘어왔는지 검증한다
  indexDao.js에서 데이터를 파라미터로 받아온다
  내용확인한다
  jwt 발급한다
  */
 const {userID, password} = req.body;

 if(!userID||!password){
  return res.send({
    isSuccess:false,
    code:400,
    message:"회원정보를 입력해주세요",
  });
 }

 try{
  //DB 연결
  const connection = await pool.getConnection(async(conn)=>(conn));
  try{
    // indexDao에서 파라미터 넘겨받아야 할 것
    const [rows] = await indexDao.validatedUser(connection,userID, password);

    // 검증
    if(rows.length<1){
      return res.send({
        isSuccess:false,
        code:400,
        message:"회원정보가 없습니다",
      });
    }
    
    const {userIdx, nickname} = rows[0];
    //rows[0].userIdx

    //JWT 발급
    const token = jwt.sign(
      {userIdx:userIdx, nickname:nickname}, secret.jwtsecret
    );
    return res.send({
      result:{jwt:token},
      isSucces:true,
      code:200,
      message:"로그인 성공",

    });

  }catch(err){logger.error(`AccessLogin Query error\n: ${JSON.stringify(err)}`);
  return false;}finally{connection.release();}
 }catch(err){logger.error(`AccessLogin DB connection error\n: ${JSON.stringify(err)}`);
 return false;}

};

//******************************************** */
// 예시 코드
exports.example = async function (req, res) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.exampleDao(connection);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};

exports.readRestaurants = async function (req,res){
  const {Category} = req.query;

  if (Category){
    const validCategory = [
      "한식", "중식", "일식", "양식", "분식", "구이", "회/초밥", "기타",
    ];
    if (!validCategory.includes(Category)){ //include가 뭘까?(자바스크립트 요소 포함 여부, true/false 반환)
      return res.send({
        isSuccess: false, code:400, message:"유효한 카테고리가 아닙니다",
      });
    }
  }
  try{
    const connection = await pool.getConnection(async (conn) => conn); //db연결
    try{
      const [rows] = await indexDao.selectRestaurants(connection, Category);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200,
        message: "식당 목록 요청 성공",
      });
    } catch (err) {
      logger.error(`readRestaurants Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally{
      connection.release();
    }
  }catch(err){
    logger.error(`readRestaurants DB Connection error\n: ${JSON.stringify(err)}`); 
    return false;
  }
};

