$(function() {
	var baseUrl = 'http://widgets.vvo-online.de/abfahrtsmonitor/Abfahrten.do?ort=Dresden&vz=0&hst=';
	
	// Define stations
	var stations = [
		{'id': '33000042', 'station': 'Trinitatisplatz'},
		{'id': '33000062', 'station': 'Fetscherplatz'},
		{'id': '33000001', 'station': 'Bahnhof Mitte'},
		{'id': '33000134', 'station': 'Muenchner Platz'},
		{'id': '33000013', 'station': 'Albertplatz'},
		{'id': '33000016', 'station': 'Bahnhof Neustadt'},
		{'id': '33000132', 'station': 'Nuernberger Platz'},
		{'id': '33000037', 'station': 'Postplatz'},
		{'id': '33000293', 'station': 'Waldschloesschen'},
		{'id': '33000010', 'station': 'Sachsenallee'},
	];
	
	// Define route colors
	var colors = {
		3: 'E5005A',
		4: 'C9061A',
		6: 'F9B000',
		7: '9E0234',
		8: '229133',
		11: 'C1DCAF',
		12: '006B42'
	};

	// Append stations to user interface
	$.each(stations, function(idx, item) {
		var html = '<li class="list-group-item station"><a href="' + baseUrl
				+ item.station + '" data-station="' + item.station + '">' + item.station
				+ '</a>'
				+ '<div class="close"><i class="fa fa-close"></i></div>'
				+ '<i class="loader fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>'
				+ '<div class="result"></div>'
				+ '</li>';
		$('#stations').append(html);
	});
	
	// Handle clicks
	$('#stations > li > a').click(function(e) {
		e.preventDefault();

		$('#stations > li > a').not(this).parent('li').find('.result').hide();
		$('#stations > li > .close').hide();

		var $item = $(this);
		var $result = $item.parent('li').find('.result');
		$result.empty();

		var $loader = $item.parent('li').find('.loader');
		$loader.css('visibility', 'visible');

		var $close = $item.parent('li').find('.close');

		var station = $item.data('station');
		var url = baseUrl + station;

		// Fetch data from dvb trinity backend
		$.get(url, function(data) {

			data = JSON.parse(data);
			console.log(data);

			var item;
			var html = '';

			for (var idx = 0; idx < data.length; idx++) {

				var routeColor = '';
				if(colors[data[idx][0]] !== null) {
					routeColor = '#' + colors[data[idx][0]];
				}

				routeFontSize = '';
				if(data[idx][0].length > 3) {
					routeFontSize = 'font-size:0.7em;';
				}

				html += '<div class="row station-ride">' + 
								'<div class="col-md-2 col-xs-4 row-left">' +
	                                '<div class="route label label-default" style="'+routeFontSize+'background-color:'+routeColor+'">'+data[idx][0]+'</div>' +
	                            '</div>' +
	                            '<div class="col-md-5 hidden-sm-down row-center">' +
	                                '<div class="direction">' + 
	                                	data[idx][1] +
	                            	'</div>' +
	                                // '<div class="time">'+item.time+'</div>' +
	                                // '<div class="delay label label-default" style="background-color:'+delayColor+'">'+item.delay+'</div>' +
	                            '</div>' +
	                            '<div class="col-md-5 col-xs-8 row-right">' +
	                                '<div class="direction hidden-md-up">'+data[idx][1]+'</div>' +
	                                '<div class="wait">'+data[idx][2]+'</div>' +
	                            '</div>' +
	                        '</div>';

			}

			$result.append(html).hide().slideDown(350, function() {
				$close.show();
			});
			$loader.css('visibility', 'hidden');
		// });
		});
	});

	$('#stations > li > .close').click(function(e) {
		var $this = $(this);

		$('#stations > li > .close').hide();
		
		$this.parent('li').find('.result').empty().slideUp(100);
	});
});