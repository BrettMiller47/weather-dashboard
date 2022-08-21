var keyApi = '330cb464329e41999c31c32720f441af';
var city = 'Denver';
var stateCode = 'CO';
var requestUrl = 'https://api.weatherbit.io/v2.0/forecast/daily/?units=i&city=' + city + ',' + stateCode + '&key=' + keyApi;

function getApiData(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                console.log(data);
        });
    
}

getApiData(requestUrl);