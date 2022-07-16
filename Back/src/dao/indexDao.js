const { pool } = require("../../config/database");


// 회원정보 USER 테이블 : insert 쿼리를 날린다
exports.InsertUsers= async function(connection, userID, password, nickname){
  //쿼리 날리기
  const Query =`insert into USER(userID,password,nickname) values (?,?,?);`;
  const Params=[userID, password, nickname]; 
  const rows= await connection.query(Query,Params);

  return rows;
  
};


exports.exampleDao = async function (connection, params) {
  const Query = ``;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.selectRestaurants = async function(connection, Category){
  const selectAllRestaurantsQuery =`select RestaurantTitle, RestaurantAddress, VideoURL, Category from Restaurant where status='A';`;
  const selectCategorizedRestaurantsQuery=`select RestaurantTitle, RestaurantAddress, VideoURL, Category from Restaurant where status='A' and Category=?;`;

  const Params = [Category];

  const Query = Category ? selectCategorizedRestaurantsQuery : selectAllRestaurantsQuery;

  const rows= await connection.query(Query,Params);

  return rows;
};
