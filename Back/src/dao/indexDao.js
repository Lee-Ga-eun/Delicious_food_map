const { pool } = require("../../config/database");

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
