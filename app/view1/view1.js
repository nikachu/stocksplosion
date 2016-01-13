'use strict';

// CONFIG
// number of days to show for comparison
var nd = 5; 
// message if no lookup results were found
var http_error_code = "No entry found.";
// lookup if there is no trading advice for whatever reason
var trading_advice_noresults = "No trading advice available.";
// trading advice messages
var trading_advice_wait = 'Wait';
var trading_advice_buy = 'Buy';
var trading_advice_sell = 'Sell';
// threshold for WAIT calculation
var calc_wait = 600;


// APP
// angular app start
var app = angular.module('stockApp', ['ngRoute', 'chart.js'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view1/view1.html',
    controller: 'stocksCtrl'
  });
}])
.controller('stocksCtrl', function($scope, $http){

// ticker form input field preset and regex pattern for validation
	 $scope.example = {
        text: '',
        word: /^[A-Z]{4}$/
      };

// onclick event for lookup button
	$scope.lookupStock = function(){
		$scope.http_error = "";
		var code = $scope.example.text;
// TODO logic to lookup the start date in a previous month		
		var date = new Date();
		var year = date.getFullYear().toString();
		var month = (1+(date.getMonth())).toString();
		var day = date.getDate();
// TODO test nd is INT
		var day2 = (day-nd).toString();
		var day1 = day.toString();
		if (month.length < 2){ month = "0"+month};
		if (day1.length < 2){ day1 = "0"+day1};
		if (day2.length < 2){ day2 = "0"+day2};
		var date_to = year+month+day1;
		var date_from = year+month+day2;
		var query = 'http://stocksplosion.apsis.io/api/company/'+code+'?startdate='+date_from+'&enddate='+date_to;
// Stocksplosion API lookup
		$http.get(query)
		.success(function(data){
			$scope.company = data.company.name;
			$scope.symbol = data.company.symbol;
			$scope.updated_at = data.company.updated_at;
			
// arrays for chart data			
			var labels = [];
			var points = [];

// loop over returned prices and sort dates and price values into respective chart arrays
			var d = data.prices;

			for (var i in d){
				labels.push(i);
				points.push(d[i]);
			}

			var fp = points[0];
			// TODO test nd is INT
			var lp = points[nd-1];
			
// set chart labels and data points
			$scope.labels = labels;
  			$scope.series = [data.company.symbol];
  			$scope.data = [ points];
  			
  			// This is the logic to display trading advice. Not based on solid research but basic trends.
  			if ( (fp > 0) && (lp > 0)){
  				// TODO testc if calc_wait is INT
  				if (fp > lp) {
  					if ((fp-lp) < calc_wait){
  						$scope.advice = trading_advice_wait;
  					} else {
  						$scope.advice = trading_advice_sell;
  					}

  				}
  				 else {
  				 	if ((lp-fp) < calc_wait){
  				 		$scope.advice = trading_advice_wait;
  				 	} else {
  				 		$scope.advice = trading_advice_buy;

  				 	}

  				 }
			} else {
				$scope.advice = trading_advice_noresults;
			}
			
		}).error(function(data, status, headers, config) {
   		 	$scope.http_error = http_error_code;
  		});

	
	}
})


