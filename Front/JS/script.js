
var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(37.54, 126.96), //지도의 중심좌표.
	level: 8 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// **********************************************************
// 더미데이터 준비: Axios로 식당 목록 조회 API를 요청
async function getDataSet(category){
	let qs = category;
	if (!qs){
		qs="";
	}
	
	const dataSet = await axios({
		method: "get",
		url: `http://localhost:3000/restaurants?category=${qs}`,
		headers: {}, // packet header
		data: {}, // packet body
	});
	return dataSet.data.result; // console.log(dataSet) 해볼 것
}

getDataSet();


// // 주소-좌표 변환 객체를 생성합니다
// var geocoder = new kakao.maps.services.Geocoder();
//   for (var i = 0; i < dataSet.length; i ++) {
// 	// 주소를 좌표로 변환하는 코드
// 	geocoder.addressSearch(dataSet[i].address, function(result, status) {
//     // 정상적으로 검색이 완료됐으면 
//      if (status === kakao.maps.services.Status.OK) {
//         var coords = new kakao.maps.LatLng(result[0].y, result[0].x); //변환한다
//     }
// 	   // 마커 생성
// 	   var marker = new kakao.maps.Marker({
//         map: map, // 마커를 표시할 지도
//         position: coords, // 마커를 표시할 위치 (좌표로 변환된 coords 집어넣는다)
//     });
// 	});    
// }

// 비동기 처리로 구현
var geocoder = new kakao.maps.services.Geocoder();

// async function setMap(){
// 	for (var i = 0; i < dataSet.length; i ++) {
// 		// 마커 생성
// 		let coords=await getCoordsByAddress(dataSet[i].address);
// 		var marker = new kakao.maps.Marker({
// 		 map: map, // 마커를 표시할 지도
// 		 position: coords, // 마커를 표시할 위치 (좌표로 변환된 coords 집어넣는다)
// 	 });	 
// 	   // 마커에 표시할 인포윈도우를 생성합니다 
// 	   var infowindow = new kakao.maps.InfoWindow({
//         content: positions[i].content // 인포윈도우에 표시할 내용
//     });
//     // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
//     // 이벤트 리스너로는 클로저를 만들어 등록합니다 
//     // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
//     kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
//     kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
// }
//  }


// 주소 -> 좌표 변환 함수
function getCoordsByAddress(address){

	return new Promise((resolve, reject)=>{

			// 주소를 좌표로 변환하는 코드
			geocoder.addressSearch(address, function(result, status) {
				// 정상적으로 검색이 완료됐으면 
				 if (status === kakao.maps.services.Status.OK) {
					var coords = new kakao.maps.LatLng(result[0].y, result[0].x); //변환한다
					resolve(coords);
					return;
				}
				reject(new Error("getCoordsByAddress Error: not Valid Address"));
			});   
		});
 	}

function getContent(data){
	// 유튜브 썸네일 id 가져오기
	let replaceUrl = data.VideoURL;
	let finUrl = '';
	replaceUrl = replaceUrl.replace("https://youtu.be/", '');
	replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", '');
	replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", '');
	finUrl = replaceUrl.split('&')[0]; 
	// 인포윈도우를 만들어서 리턴한다 (). 백틱을 이용해 html에 집어넣는다
	//  content: getContent(dataSet[i])
	return `
	<div class="infoWindow">
      <div class="infoWindow-img-container">
        <img src="https://img.youtube.com/vi/${finUrl}/mqdefault.jpg" class="infoWindow-img">  
      </div>
      <div class="infoWindow-body">
        <h5 class="infoWindow-title">${data.RestaurantTitle}</h5>
        <p class="infoWindow-address">${data.RestaurantAddress}</p>
        <a href="${data.VideoURL}" class="infoWindow-btn" target="_blank">영상이동</a> <!--새창으로 이동하도록 target-->
      </div>
    </div>
	
	
	`;
}

// 마커에 인포윈도우 붙이기

async function setMap(dataSet){
	infowindowArray=[];
	markerArray=[];
	for (var i = 0; i < dataSet.length; i ++) {
		// 마커 생성
		//let coords=await getCoordsByAddress(dataSet[i].address);
		let coords=await getCoordsByAddress(dataSet[i].RestaurantAddress);
		var marker = new kakao.maps.Marker({
		 map: map, // 마커를 표시할 지도
		 position: coords, // 마커를 표시할 위치 (좌표로 변환된 coords 집어넣는다)
	 });	 

	 markerArray.push(marker);
	  // 마커에 표시할 인포윈도우를 생성합니다 
	var infowindow = new kakao.maps.InfoWindow({
        content: getContent(dataSet[i]) // 인포윈도우에 표시할 내용
    });
	infowindowArray.push(infowindow); //생성될 때마다 객체 추가

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다 
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
	// mouseover --> click
    kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow, coords)); //coords 인자 추가
    kakao.maps.event.addListener(map, 'click', makeOutListener(infowindow)); // 지도를 클릭하면 꺼지게끔 한다
}
}

// 1. 클릭시 다른 인포위도우 닫기
// 2. 클릭한 곳으로 지도 중심 옮기기

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow, coords) {
     return function() {
		// 클릭시 다른 인포윈도우 닫기
		closeInfoWindow(); 
        infowindow.open(map, marker);
		// 클릭한 곳으로 지도 중심 옮기기
		map.panTo(coords);
    };
}
let infowindowArray=[];
function closeInfoWindow(){
		for (let infowindow of infowindowArray){
			infowindow.close();
		}
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
       return function() {
          infowindow.close();
      };
}

 
/*
-------------------카테고리 분류-----------------
*/

const categoryMap={
	korea:"한식",
	china:"중식",
	japan:"일식",
	america:"양식",
	wheat:"분식",
	meat:"구이",
	sushi:"회/초밥",
	etc:"기타"
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

async function categoryHandler(event){
	// event가 어떤 태그에서 일어났는지 등을 다 갖고 있다
	//console.log(event.target.id);  -> 클릭하면 korea 등
	const categoryId= event.target.id;
	const category= categoryMap[categoryId];
	try{
	//데이터 분류
	// 카테고리에 해당하는 데이터만 뽑아내기
	let categorizedDataSet = await getDataSet(category);
	// for (let data of dataSet){
	// 	if(data.category===category){ //사용자가 클릭한 데이터와 일차한다면
	// 		categorizedDataSet.push(data);
	// 	} // 이제 한식을 누르면 한식 데이터만 뜨게끔 한다
	// }
	// 기존 마커 삭제
	closeMarker();
	// 기존 인포윈도우 닫기
	closeInfoWindow();
	setMap(categorizedDataSet);
 } catch(error) {console.error(error);}}

// closeMarker() 함수 작성
let markerArray=[];
function closeMarker(){
	for (marker of markerArray){
		marker.setMap(null);
	}
}

async function setting(){
	try{
		const dataSet = await getDataSet();
		setMap(dataSet);
	} catch(error){console.error(error);}
}

setting();