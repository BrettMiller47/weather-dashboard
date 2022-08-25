// ---- Date section ----
const today = new Date();
const currMonth = today.getMonth();
const currDay = today.getDate();
const currYear = today.getFullYear();
const dateTodayText = '(' + currMonth + "/" + currDay + "/" + currYear + ')';
const todayHeaderEl = document.querySelector('#today-header');
todayHeaderEl.textContent = dateTodayText; 

// ---- API & Dynamic DOM section ----
var searchBtnEl = document.querySelector('#search');
searchBtnEl.addEventListener('click', checkConditions);

// function to getApiData IF all input criteria is acceptable
function checkConditions(event) {

    // prevent page refreshes and delete previous error messages (if any exist)
    event.preventDefault();
    removeErrorMessages();
    
    // Prompt the user with error messages until an acceptable response is found
    let userInput = document.querySelector('#city').value;    
    
    // If userInput is acceptable...
    if (isAcceptableCity(userInput)) {
        // update local storage
        updateLocalStorage(userInput);
        // create search history buttons
        updateHistoryButtons();
        // Get the new data
        getApiData(userInput);
    }
}

// function which updates (or creates) a localStorage object 'searchHistory' where key: value == locationName: nSearches
function updateLocalStorage(locationName) {

    let searchHistory = JSON.parse(localStorage.getItem('searchHistory'))

    // If searchHistory is not found in localStorage...
    if (searchHistory == null) {
        // add searchHistory[locationName] = 1 to local storage
        let newDict = {};
        newDict[locationName] = 1;
        let newJsonDict = JSON.stringify(newDict);
        localStorage.setItem('searchHistory', newJsonDict);
    } else {
        // if the locationName is in searchHistory..
        if (locationName in searchHistory) {
            // add 1 to locationName's existing search count
            searchHistory[locationName] = searchHistory[locationName] + 1;
        }
        else {
            // add locationName to searchHistory with a search count of 1
            searchHistory[locationName] = 1;
        }
        // sort searchHistory such that highest searchCount values are the first indexed keys
        //bubbleSortHighToLow(searchHistory);
        // update localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

/**
 * Gathers and manipulates the API data for today and the subsequent 5-day forecast
 * @param {string} city - The city used to filter the API data. 
 */
// function which gathers and manipulates API data for today and the subsequent 5-day forecast
function getApiData(city) {
    let key = '330cb464329e41999c31c32720f441af';
    let requestUrl = 'https://api.weatherbit.io/v2.0/forecast/daily/?units=i&city=' + city + '&key=' + key;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                console.log(data);
                // Populate today's info
                document.querySelector('#today-header').textContent = city + " " + dateTodayText;
                
    
                // temp, wind, UV, humidity
                // loop through the first six days of API data
                for (let i = 0; i < 6; i++){
                    let temp = data['data'][i].temp;
                    let wind = data['data'][i].wind_spd;
                    let uv = data['data'][i].uv;
                    let humidity = data['data'][i].rh;
                    // If today...
                    if (i == 0) {
                        document.querySelector('#temp-today').textContent = 'Temp: ' + temp + '°F';
                        document.querySelector('#wind-today').textContent = 'Wind: ' + wind + ' mph';
                        document.querySelector('#uv-today').textContent = 'UV Index: ' + uv;
                        document.querySelector('#humidity-today').textContent = 'Humidity: ' + humidity + ' %';
                    } else {
                        // update the 5-day forecast
                        document.querySelector('#temp-' + i).textContent = 'Temp: ' + temp + '°F';
                        document.querySelector('#wind-' + i).textContent = 'Wind: ' + wind + ' mph';
                        document.querySelector('#humidity-' + i).textContent = 'Humidity: ' + humidity + ' %';
                    }
                }
        });
}

// event listener for previously searched locations
$('.btn-secondary').on('click', function () {
    let city = $(this).text();
    // update local storage
    updateLocalStorage(city);
    getApiData(city);
});

//------------------------------------------------------------------------
/// don't need to do this if search came from a button that are already displayed
function updateHistoryButtons(vent) { 
    let rootEl = document.querySelector('#button-root');
    
    // create a button element with textContent=city and 

}
//------------------------------------------------------------------------

/**
 * Determines if the city's name is an acceptable string.
 * @param {string} cityName 
 * @returns {boolean} true - Acceptable city Name
 * @returns {boolean} false - Unacceptable city Name
 */
// function which returns a boolean value where true=Acceptable and false=Unacceptable 
function isAcceptableCity(cityName) {
    // If no cityName...
    if (cityName == "") {
        // dynamically add the error message to the DOM underneath the search header
        let searchHeaderEl = document.querySelector('#search-header'); 
        let searchErrorEl = document.createElement('p');
        searchErrorEl.setAttribute('class', 'error text-danger m-0');
        searchErrorEl.textContent = 'Error: Please enter a city name.';
        searchHeaderEl.append(searchErrorEl);
        // cityName did not meet acceptable criteria
        return false;
    } else {
        // cityName met all acceptance criteria
        return true;
    }
}

/**
 * Removes all elements with class='.error'
 */
function removeErrorMessages() {
    // Select all elements with class='.error' from the DOM
    let errors = document.querySelectorAll('.error');

    // Remove each error from the DOM
    errors.forEach(error => {
        error.remove();
    });     
}

/**
* Swap two elements in an array.
* @param {array} arr - The original array.
* @param {number} xIdx - The index of the first element to swap.
* @param {number} yIdx - The index of the second element to swap..
*/
function swap(arr, xIdx, yIdx) {
    var temp = arr[xIdx];
    arr[xIdx] = arr[yIdx];
    arr[yIdx] = temp;
}

/**
 * Sorts a numerical array from High to Low.
 * @param {array} arr - The original array.
 */
function bubbleSortHighToLow(arr) {
    
    // For each indexed element in 
    for (let i = 0; i < arr.length; i++) {
        // loop through each remaining element in the array
        for (let j = i + 1; j < arr.length; j++)
            if (arr[i] < arr[j]) {
                swap(arr, i, j);
            } 
    }
}