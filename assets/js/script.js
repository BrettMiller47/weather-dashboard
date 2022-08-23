// ---- Date section ----
var today = new Date();
var currMonth = today.getMonth();
var currDay = today.getDate();
var currYear = today.getFullYear();
var dateTodayText = '(' + currMonth + "/" + currDay + "/" + currYear + ')';
var todayHeaderEl = document.querySelector('#today-header');
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
    var userInput = document.querySelector('#city').value;    
    
    // If userInput is acceptable...
    if (isAcceptableCity(userInput)) {
        // update local storage
        updateLocalStorage(userInput);
        // update search history
        updateSearchHistory(userInput);
        // create search history buttons
        //updateHistoryButtons();
        // Get the new data
        getApiData(userInput);
    }
}

// function which updates (or creates) a localStorage object 'searchHistory' where key: value == locationName: nSearches
function updateLocalStorage(locationName) {

    var searchHistory = JSON.parse(localStorage.getItem('searchHistory'))

    // If searchHistory is not found in localStorage...
    if (searchHistory == null) {
        // add searchHistory[locationName] = 1 to local storage
        var newDict = {};
        newDict[locationName] = 1;
        var newJsonDict = JSON.stringify(newDict);
        localStorage.setItem('searchHistory', newJsonDict);
    } else {
        // if the locationName is in searchHistory..
        if (locationName in searchHistory) {
            // add 1 to locationName's existing search count
            searchHistory[locationName] = searchHistory[locationName] + 1;
            // update localStorage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
        else {
            // add locationName to searchHistory with a search count of 1
            searchHistory[locationName] = 1;
            // update localStorage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }
}

// function which dynamically adds buttons to the DOM for the most frequent searches
function updateSearchHistory() {
    
    // parse the 'searchHistory' array stored in localStorage
    
    var maxNumBtn = 8;
    var buttons = [];
    var floorSearches = 0;
    // for each key in localStorage...
        // if floorSearches is less than the current key's (location) searches
            
            // if fewer keys than the max number of buttons have been checked...
                // add current key to the array of buttons
                
            // if floorSearches add the current key to the

        // re-calculate floorSearches
        getLowValueIndex(buttons);
}

// function which returns the first index of the lowest value in an arrayOfNumbers
function getLowValueIndex(arrayOfNumbers) {

    // if arrayOfNumbers was empty return nothing
    if (arrayOfNumbers.length == 0) {
        return;
    } else {
        // for each value in the arrayOfNumbers, set lowVal = lowest value checked so far
        for (var i = 0; i < arrayOfNumbers.length; i++) {
            var indexedVal = arrayOfNumbers[i];
            // If the first element...
            if (i == 0) {
                var lowVal = indexedVal;
            }
            // If NOT the first element and the value is lower than the lowest value checked so far...
            else if (indexedVal < lowVal) {
                lowVal = indexedVal;
            }
        }
        // return the first index position of the lowest value in arrayOfNumbers
        var indexLow = arrayOfNumbers.indexOf(lowVal);
        return indexLow;        
    }
}

// function which gathers and manipulates API data for today and the subsequent 5-day forecast
function getApiData(city) {
    
    var key = '330cb464329e41999c31c32720f441af';
    var requestUrl = 'https://api.weatherbit.io/v2.0/forecast/daily/?units=i&city=' + city + '&key=' + key;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
            .then(function (data) {
                console.log(data);
                // Populate today's info
                document.querySelector('#today-header').textContent = city + " " + dateTodayText;
                
                
                // Populate the 5-day forecast info
        });
}

// function which returns a boolean value where true=Acceptable and false=Unacceptable 
function isAcceptableCity(cityName) {
    cityName.trim();
    // If no cityName...
    if (cityName == "") {
        // dynamically add the error message to the DOM underneath the search header
        var searchHeaderEl = document.querySelector('#search-header'); 
        var searchErrorEl = document.createElement('p');
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

// function which removes all elements with a class='.error'
function removeErrorMessages() {

    // Select all elements with class='.error' from the DOM
    var errors = document.querySelectorAll('.error');

    // Remove each error from the DOM
    errors.forEach(error => {
        error.remove();
    });     
}