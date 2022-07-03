
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




// 더미데이터 생성

const dataSet = [
	{
	  title: "희락돈까스",
	  address: "서울 영등포구 양산로 210",
	  url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
	  category: "양식",
	},
	{
	  title: "즉석우동짜장",
	  address: "서울 영등포구 대방천로 260",
	  url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
	  category: "한식",
	},
	{
	  title: "아카사카",
	  address: "서울 서초구 서초대로74길 23",
	  url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
	  category: "일식",
	},
  ];

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

setMap();



function getContent(data){
	// 인포윈도우를 만들어서 리턴한다 ()
	return `<div>hello</div>`;
}


// 마커에 인포윈도우 붙이기

async function setMap(){

	for (var i = 0; i < dataSet.length; i ++) {
		// 마커 생성
		let coords=await getCoordsByAddress(dataSet[i].address);
		var marker = new kakao.maps.Marker({
		 map: map, // 마커를 표시할 지도
		 position: coords, // 마커를 표시할 위치 (좌표로 변환된 coords 집어넣는다)
	 });	 


	  // 마커에 표시할 인포윈도우를 생성합니다 
	  var infowindow = new kakao.maps.InfoWindow({
        content: getContent(dataSet[i]) // 인포윈도우에 표시할 내용
    });

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다 
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
}

	// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
	function makeOverListener(map, marker, infowindow) {
     return function() {
        infowindow.open(map, marker);
    };
}

	// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
	function makeOutListener(infowindow) {
     return function() {
        infowindow.close();
    };
}
}
 