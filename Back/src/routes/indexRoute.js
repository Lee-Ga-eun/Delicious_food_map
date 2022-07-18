module.exports = function (app) {
  const index = require("../controllers/indexController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // 라우터 정의
  // app.HTTP메서드(uri, 컨트롤러 콜백함수)
  //app.get("/dummy", index.example);


  // 회원가입 api, 로그인 api, 토큰 검증 api 
  app.get("/restaurants", index.readRestaurants);
  app.post("/register", index.createRegister); //회원가입
  app.post("/login", index.AccessLogin);
  //jwt 미들웨어
  app.get("/login",jwtMiddleware, index.validation_token);
};
