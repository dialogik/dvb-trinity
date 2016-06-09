$(function() {
	// var baseUrl = 'http://localhost/dvb-trinity-backend/www/api.php?station=';
	var baseUrl = 'https://dvb-trinity.herokuapp.com/api.php?station=';

	var stations = [
		{'id': '33000042', 'station': 'Trinitatisplatz'},
		{'id': '33000062', 'station': 'Fetscherplatz'},
		{'id': '33000132', 'station': 'Nuernberger Platz'},
		{'id': '33000134', 'station': 'Muenchner Platz'},
		{'id': '33000013', 'station': 'Albertplatz'},
		{'id': '33000016', 'station': 'Bahnhof Neustadt'},
		{'id': '33000037', 'station': 'Postplatz'},
		{'id': '33000010', 'station': 'Sachsenallee'},
		{'id': '33000293', 'station': 'Waldschloesschen'}
	];
	
	var routes = {
		3: 'E5005A',
		4: 'C9061A',
		6: 'F9B000',
		7: '9E0234',
		8: '229133',
		11: 'C1DCAF',
		12: '006B42'
	};

	$.each(stations, function(idx, item) {
		var html = '<li class="list-group-item station"><a href="https://m.dvb.de/de/abfahrtsmonitor/abfahrten.do?id='
				+ item.id + '" data-id="' + item.id + '">' + item.station
				+ '</a>'
				+ '<div class="close"><i class="fa fa-close"></i></div>'
				+ '<i class="loader fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>'
				+ '<div class="result"></div>'
				+ '</li>';
		$('#stations').append(html);
	});
	
	$('#stations > li > a').click(function(e) {
		e.preventDefault();

		$('#stations > li > a').not(this).parent('li').find('.result').hide();

		var $item = $(this);
		var $result = $item.parent('li').find('.result');
		$result.empty();

		var $loader = $item.parent('li').find('.loader');
		$loader.css('visibility', 'visible');

		var $close = $item.parent('li').find('.close');

		var id = $item.data('id');
		var url = baseUrl + id;

		// $result.show();

		$.get(url, function(data) {
			$.each(data, function(idx, item) {

				var routeColor = '';
				if(routes[item.route] !== null) {
					routeColor = '#' + routes[item.route];
				}

				var delayColor = 'red';
				if(item.delay == 'pünktlich') {
					var delayColor = 'green';
				}

				if(item.wait == 'null' || item.wait == null) {
					item.wait = '';
				}

				routeFontSize = '';
				if(item.route.length > 3) {
					routeFontSize = 'font-size:0.7em;';
				}

				var html = '<div class="row station-ride">' + 
								'<div class="col-md-2 col-xs-4 row-left">' +
	                                '<div class="route label label-default" style="'+routeFontSize+'background-color:'+routeColor+'">'+item.route+'</div>' +
	                            '</div>' +
	                            '<div class="col-md-5 hidden-sm-down row-center">' +
	                                '<div class="direction">' + 
	                                	item.direction+' <span class="track">'+item.track+'</span>' +
	                            	'</div>' +
	                                '<div class="time">'+item.time+'</div>' +
	                                '<div class="delay label label-default" style="background-color:'+delayColor+'">'+item.delay+'</div>' +
	                            '</div>' +
	                            '<div class="col-md-5 col-xs-8 row-right">' +
	                                '<div class="direction hidden-md-up">'+item.direction+'</div>' +
	                                '<div class="wait">'+item.wait+'</div>' +
	                            '</div>' +
                            '</div>';

				$result.append(html).hide().slideDown(350);
				$close.show();
				$loader.css('visibility', 'hidden');
			});
		});
	});

	$('#stations > li > .close').click(function(e) {
		var $this = $(this);
		
		$this.parent('li').find('.result').empty().slideUp(100);
		$this.hide();
	});
});
