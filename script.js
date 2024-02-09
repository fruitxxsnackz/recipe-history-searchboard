
// Making sure functions run after HTML loads.
document.addEventListener('DOMContentLoaded', function() {
  var pagearray = [];
  // Run fetchwikipedia when button is clicked; API documentation.
  document.getElementById('searchBtn').addEventListener('click', function () {
      var searchinput = document.getElementById('searchBarInput').value.toLowerCase();
      var api = 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles='+searchinput+'&prop=extracts&exintro&origin=*';

      fetchwikipedia(api);
  });

  //API fetch request; extract data and store in an array; calling showhistory function.
  function fetchwikipedia(api) {
      fetch(api).then(function(response) {
          if (response.ok) {
              response.json().then(function (data) {
                  var infosections = data.query.pages;
                  var headsec = Object.keys(infosections)[0];
                  var extractpage = infosections[headsec].extract;
                  pagearray.push(extractpage);
                  showHistory(pagearray);
              });
          } else if (response.status !== 200) {
              throw "Status Error";
          }
      });
  }

  // Making sure there is no prev info; create element for retrieved history; append elements so it can show on HTML.
  function showHistory(history) {
      var WikiData = document.getElementById('data');
      WikiData.textContent = '';

      for (let i = 0; i < history.length; i++) {
          var divsec = document.createElement('p');
          divsec.textContent = history[i];
          WikiData.appendChild(divsec);
      }
  }
});

