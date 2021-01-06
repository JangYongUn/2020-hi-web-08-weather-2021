// function a(arg, arg2) {}
// arguments, parameters, 인자, 매개변수 ...

// $.get(url, cb);
// $.get(url, params(쿼리를 객체형태로 전송), cb);


// 웹사이트 주소체계: https://nodejs.org/dist/latest-v15.x/docs/api/url.html

// AJAX 통신
/*
var url = 'http://api.openweathermap.org/data/2.5/onecall?lat=38&lon=127&appid=7e9fe622cfa1cb7e7399447de68c392f&units=metric&exclude=minutely,hourly';
function onGet(r) {
	console.log(r);
}

$("#bt").click(function(){
	$.get(url, onGet);
});
*/


// openweather app : 7e9fe622cfa1cb7e7399447de68c392f    (본인거로)
// kakao developers map : cd85347e3ff4d4312dd4f3f9d775ce8a    (본인거로)

// openweather app 7days : http://api.openweathermap.org/data/2.5/onecall?lat=38&lon=127&appid=7e9fe622cfa1cb7e7399447de68c392f&units=metric&exclude=minutely,hourly

// 오픈웨더맵 아이콘 : http://openweathermap.org/img/wn/10d.png



/********* 전역설정 **********/
var map;
var citiesk;
var cityCnt = 0;	// onCreateMarker에서 갯수를 센다.
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
var params = {
	appid: '02efdd64bdc14b279bc91d9247db4722',
	units: 'metric',
	lang: 'kr'
}


/********* 이벤트등록 **********/

navigator.geolocation.getCurrentPosition(onGetPosition, onGetPositionError);

$(window).resize(onResize);

mapInit();



/********* 이벤트콜백 **********/
function onResize() {
    map.setCenter(new kakao.maps.LatLng(35.8, 127.7));
}

function onGetPosition(r) {
    getWeather(r.coords.latitude, r.coords.longitude);
    /* console.log(r.cppds);
    dailyWeather(); */
}

function onGetPositionError(e) {
    getWeather(37.566679, 126.978413);
    /* //7.566679, 126.978413
    console.log(e);
    dailyWeather(); */
}

function onGetWeather(r) {
	console.log(r);
	console.log(r.weather[0].icon);
	updateBg(r.weather[0].icon);
}

function onGetCity(r) {
    //createMarker(r.cities);
	// 변경할 사항은 위의 createMarker를 실행하지 않고, openweathermap 통신으로 날씨정보를 받아오는게 완료되면 그때 그 정보로 marker를 만든다.
	cities = r.cities;
	for(var i in cities) {
		params.lat = '';
		params.lon = '';
		params.id = cities[i].id;
		$.get(weatherUrl, params, onCreateMarker);
	}
}

function onCreateMarker(r) {
	/* for(var i in cities) {
		if(cities[i].id === r.id) {
			r.cityName = cities[i].name;
			break;
		}
	} */
	cityCnt++;
	var city = cities.filter(function(v){
		return v.id === r.id;
	});
	var content = '';
	content += '<div class="popper '+city[0].class+'">';
	content += '<div class="img-wrap">';
	content += '<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
	content += '</div>';
	content += '<div class="cont-wrap">';
	content += '<div class="name">'+city[0].name+'</div>';
	content += '<div class="temp">'+r.main.temp+'도</div>';
	content += '</div>';
	content += '<i class="fa fa-caret-down"></i>';
	content += '</div>';
	var position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon); 
	var customOverlay = new kakao.maps.CustomOverlay({
		position: position,
		content: content
	});
	customOverlay.setMap(map);

	content  = '<div class="city swiper-slide">';
	content += '<div class="name">'+city[0].name+'</div>';
	content += '<div class="content">';
	content += '<div class="img-wrap">';
	content += '<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
	content += '</div>';
	content += '<div class="cont-wrap">';
	content += '<div class="temp">온도&nbsp;&nbsp; '+r.main.temp+'도</div>';
	content += '<div class="temp">체감&nbsp;&nbsp; '+r.main.feels_like+'도</div>';
	content += '</div></div></div>';
	$('.city-wrap .swiper-wrapper').append(content);
	if(cityCnt == cities.length) {
		var swiper = new Swiper('.city-wrap .swiper-container', {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: true,
			navigation: {
        nextEl: '.city-wrap .bt-next',
        prevEl: '.city-wrap .bt-prev',
      },
			breakpoints: {
				576: { slidesPerView: 3 },
				768: { slidesPerView: 4 },
			}
		});
	}
}



/********* 사용자함수 **********/

function getWeather(lat, lon) {
	params.id = '';
	params.lat = lat;
	params.lon = lon;
	$.get(weatherUrl, params, onGetWeather);
}

function mapInit() {
	var mapOption = { 
		center: new kakao.maps.LatLng(35.8, 127.7),
		level: 13,
		draggable: false,
		zoomable: false
	};
	map = new kakao.maps.Map($('#map')[0], mapOption);
	// map.setDraggable(false);
	// map.setZoomable(false);
	
	$(window).resize(onResize);
	$.get('../json/city.json', onGetCity);
}
/* function mapInit() {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(35.89, 127.8), // 지도의 중심좌표
        level: 13 // 지도의 확대 레벨
    };
    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    map = new kakao.maps.Map(mapContainer, mapOption);
} */

function updateBg(icon) {
	var bg;
	switch(icon) {
		case '01d':
		case '02d':
			bg = '01d.jpg';
			break;
		case '01n':
		case '02n':
			bg = '01n.jpg';
			break;
		case '03d':
		case '04d':
			bg = '03d.jpg';
			break;
		case '03n':
		case '04n':
			bg = '03n.jpg';
			break;
		case '09d':
		case '10d':
			bg = '10d.jpg';
			break;
		case '09n':
		case '10n':
			bg = '10n.jpg';
			break;
		case '11d':
			bg = '11d.jpg';
			break;
		case '11n':
			bg = '11n.jpg';
			break;
		case '13d':
			bg = '13d.jpg';
			break;
		case '13n':
			bg = '13n.jpg';
			break;
		case '50d':
			bg = '50d.jpg';
			break;
		case '50n':
			bg = '50n.jpg';
			break;
	}
	$(".all-wrapper").css('background-image', 'url(../img/'+bg+')');
}