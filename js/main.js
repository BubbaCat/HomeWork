$(document).ready(function(){

	var modelSpecsHolder = $('#modelSpecs');
		modelPriceHolder = $('#modelPrice');
		modelPriceUSDHolder = $('#modelPriceUSD');
		modelPrice = 0;
		modelSpecs = '';
	calculatePrice();
	compileSpecs();

	$('#autoForm input').on('change', function(){
		calculatePrice();
		compileSpecs();
		calculateUSD();
	});

	$('#colorsSelector .colorItem').on('click', function(){
		var imgPath = $(this).attr('data-img-path');
		$('#imgHolder img').attr('src', imgPath);
	});


	function calculatePrice(){
		var modelPriceEngine = $('input[name=engine]:checked', '#autoForm').val();
		var modelPriceTransmission = $('input[name=transmission]:checked', '#autoForm').val();
		var modelPricePackage = $('input[name=package]:checked', '#autoForm').val();
		
		modelPriceEngine = parseInt(modelPriceEngine);
		modelPriceTransmission = parseInt(modelPriceTransmission);
		modelPricePackage = parseInt(modelPricePackage);
		
		modelPrice = modelPriceEngine + modelPriceTransmission + modelPricePackage;
		modelPriceHolder.text( addSpace(modelPrice) + ' рублей');
	};

	function compileSpecs(){
		modelSpecs = $('input[name=engine]:checked + label', '#autoForm').text();
		modelSpecs = modelSpecs + ', ' + $('input[name=transmission]:checked + label', '#autoForm').text();
		modelSpecs = modelSpecs + ', ' + $('input[name=package]:checked + label', '#autoForm').text() + '.';
		modelSpecsHolder.text( modelSpecs );
	};

	function addSpace(nStr) {
	    nStr += '';
	    x = nStr.split('.');
	    x1 = x[0];
	    x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	    }
	    return x1 + x2;
	}
	var currencyUrl = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+"USDRUB,EURRUB"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
	var rurUsdRate = 0;

	$.ajax({
		url: currencyUrl,
		cache: false,
		success: function(html){
			console.log( html.query.results.rate[0].Rate );
			rurUsdRate = html.query.results.rate[0].Rate;
			calculateUSD();
		} 
	});

	function calculateUSD(){
		var modelPriceUSD = modelPrice / rurUsdRate;
		modelPriceUSDHolder.text( '$ ' + addSpace( modelPriceUSD.toFixed(0) ) );
	}


});