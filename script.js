              
// Making sure functions run after HTML loads.
document.addEventListener('DOMContentLoaded', function() {
    var pagearray = [];
    var recipes = [];

    // Run fetchwikipedia when button is clicked; API documentation.
    document.getElementById('searchBtn').addEventListener('click', function () {
        var searchinput = document.getElementById('searchBarInput').value.toLowerCase();
        var api = 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles='+searchinput+'&prop=extracts&exintro&origin=*';
        var EdAapi = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + searchinput + '&app_id=5580467d&app_key=717fcc61183eb09ca933fe3ddf73c660';

     fetchwikipedia(api);
     fetchedamam(EdAapi);
    });
  
    //API fetch request; extract data and store in an array; calling showhistory function.
    function fetchwikipedia(api) {
        fetch(api).then(function(response) {
            if (response.ok) {
             response.json().then(function (data) {
             var infosections = data.query.pages;
            var headsec = Object.keys(infosections)[0];
            var extractpage = infosections[headsec].extract;                pagearray.push(extractpage);
            showhistory(pagearray);
            });
            } else if (response.status != 200) {
                throw "Status Error"; }
        });
    }
  
    // Making sure there is no prev info; create element for retrieved history; append elements so it can show on HTML.
    function showhistory(history) {
        var WikiData = document.getElementById('data');
        WikiData.textContent = '';
         for (let i = 0; i < history.length; i++) {
        var divsec = document.createElement('p');
        divsec.textContent = history[i];
        WikiData.appendChild(divsec);
        }
    }

    function fetchedamam(EdAapi) {
        fetch(EdAapi, {
          method: 'GET',
          headers: {
           'Accept': 'application/json', }
        }).then(function(response) {
          if (response.ok) {
          response.json().then(function(data) {
          var Rlists = data.hits;
  
          if (Rlists.length > 0) {
              Rlists.forEach(function(Elist) {
               var recipe = {
               label: Elist.recipe.label,
               ingredients: Elist.recipe.ingredientLines.join('\n') };
                recipes.push(recipe); })
               displayedamam(recipes);
          } else if (response.status != 200) {
              throw "Status Error"; }
          });
        }
        });
      }

      function displayedamam(recipes) {
        var recipesection = document.getElementById('recipesection');
        recipesection.innerHTML = '';
    
        recipes.forEach(function(recipe) {
          var addrecipediv = document.createElement('div');
          
          var Recname = document.createElement('p');
          Recname.setAttribute('class', 'Recname');
          Recname.textContent = recipe.label;
          var shoplist = document.createElement('div');
          shoplist.setAttribute('class', 'shoplist');
          shoplist.style.display = 'none';
          shoplist.textContent = recipe.ingredients;
          addrecipediv.appendChild(Recname);
          addrecipediv.appendChild(shoplist);
  
          document.getElementById('recipesection').appendChild(addrecipediv);
        
          Recname.addEventListener('click', function() {
            if (shoplist.style.display === 'none') {
              shoplist.style.display = 'block';
            } else {
              shoplist.style.display = 'none'; }
          });
          recipesection.appendChild(addrecipediv);
        });
      };
  });