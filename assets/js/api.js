/* console.log("WeatherApi.com"); */

$(document).ready(function () {
	$('#fechaActual').text(' ' + obtenerFecha());
});

$('#tiempo').hide();
$('#tiempo').fadeIn(1500);

obtenerTiempo('Malaga', 'Andalucia');

$('#search').click(function () {
	$('#search').val('');
	$('#contenidoBusqueda').addClass('d-none');
});

$('#search').keyup(debounce(function () {

	if ($('#search').val().length >= 1) {
		var city = $('#search').val();
		var url = "https://weatherapi-com.p.rapidapi.com/search.json?q=" + city;
		$.ajax({
			url: url,
			method: "GET",
			headers: {
				"X-RapidAPI-Key": "",
				"X-RapidAPI-Host": ""
			}
		}).then(function (response) {
			console.log(response);
			$('#contenidoBusqueda').removeClass('d-none');
			var table = $('#resultadoBusqueda').DataTable();
			table.clear().draw();
			for (var i = 0; i < response.length; i++) {
				var city = response[i].name;
				var country = response[i].country;
				var region = response[i].region;
				var lat = response[i].lat;
				var lon = response[i].lon;
				var id = response[i].id;
				agregarListaBusqueda(city, region, country, lat, lon, id);
			}
		}
		);
	} else {
		$('#contenidoBusqueda').addClass('d-none');
	}
}, 300));

function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function agregarListaBusqueda(city, region, country, lat, lon, id) {
	var table = $('#resultadoBusqueda').DataTable();

	var resultado = (`<a id="test" data-hook="` + city + ',' + region + `" href="#"
		class="color_fondo rounded-5 text-dark pt-1 px-3 pb-1 text-dark list-group-item list-group-item-action flex-column align-items-start active">
		<div class="d-flex justify-content-between m-2 mb-2">
		  <p class="mb-1 titulo">` + city + ', ' + region + `</p>
		  <small>` + country + `</small>
		</div>
		<div class="d-flex justify-content-between m-2 mb-2">
		<small>🚩 Latitud: ` + lat + `&nbsp;&nbsp;&nbsp;&nbsp;📈 Longitud:
		  ` + lon + `</small>
		  <small>` + `</small>
	  </div>
	  </a>`);

	table.row.add([
		resultado,
	]).draw();
}

// Si le da clic a test
$('#resultadoBusqueda').on('click', '#test', function () {
	var id = $(this).data('hook');
	var city = id.split(',')[0];
	var region = id.split(',')[1];
	obtenerTiempo(city, region);
	$('#search').val('');
	$('#contenidoBusqueda').addClass('d-none');
});

function obtenerTiempo(city2, region2) {

	const settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://weatherapi-com.p.rapidapi.com/current.json?q=" + city2 + "," + region2,
		"method": "GET",
		"headers": {
			"X-RapidAPI-Key": "",
			"X-RapidAPI-Host": ""
		}
	};
	$.ajax(settings).done(function (response) {
		console.log(response);
		// Quitarle la clase d-none a la lista de busqueda
		$('#tiempo').removeClass('d-none');
		$('#listaBusqueda').addClass('d-none');
		var city = response.location.name;
		var country = response.location.country;
		var region = response.location.region;
		var lat = response.location.lat;
		var lon = response.location.lon;
		var icono = response.current.condition.icon;
		$('#ciudad').text(city + ', ' + region);
		$('#pais').text(country);
		$('#iconoTemperatura').attr('src', icono);
		$('#temperatura').text(response.current.temp_c);
		$('#temperaturaExacta').text(response.current.feelslike_c);
		$('#humedad').text(response.current.humidity);
		$('#viento').text(response.current.wind_kph);
	});
}

function obtenerFecha() {
	var fecha = new Date();
	var dia = fecha.getDate();
	var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
	var nombreMes = meses[fecha.getMonth()];
	var dias = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
	var nombreDia = dias[fecha.getDay()];
	var anio = fecha.getFullYear();
	return nombreDia + ", " + dia + ' de ' + nombreMes + " de " + anio;
}