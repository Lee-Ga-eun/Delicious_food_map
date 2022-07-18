//  jwtMiddleware 설계
// 로그인된 회원만 접근할 수 있는 페이지;; 이런 거에도 쓰인다
// 토큰 검증과 비밀키를 위해 존재한다
//시작!
//jwt 모듈을 불러와 변수에 저장한다
const jwt=require("jsonwebtoken");
//secret.js 파일에서 비밀키를 불러와야 한다. 우선 파일명을 변수로 쓰자
const secret_key=require("./secret");
// jwtMiddleware이라는 함수를 정의한다. 함수형으로 작성한다. 비동기처리는 필요하지 않다
const jwtMiddleware = function(req,res,next){
//헤더 혹은 url로부터 토큰을 읽는다
    token = req.header("x-access-token")|| req.query.token;
// 읽힌 토큰이 없다면, 로그인 되어 있지 않다는 메시지를 보낸다
    if(!token){
        res.status(403).json({
            isSuccess:false,
            code:403,
            message:"로그인 필요",
        });
    }
//읽었다면, 토큰을 검증한다. 첫번째 인자로는 토큰, 두번째 인자로는 토큰의 비밀키를 넣는다
// 이 과정에서 디코딩이 될 것이다. 토큰의 내용을 반환하여 다음 미들웨어에서 쓸 수 있도록 한다
    try{
        const decoded=jwt.verify(token, secret_key.jwtsecret);
        req.decoded=decoded;
        
//보낸다
        next();
//검증되지 않았다면, 검증 실패 메시지를 보낸다
        if(!decoded){
            res.status(403).json({
                isSuccess:false,
                code:403,
                message:"로그인 필요",
            });
        }
    }catch(err){}

};
