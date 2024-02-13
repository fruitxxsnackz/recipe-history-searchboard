
document.addEventListener("DOMContentLoaded",function() {
  var history = [];

  document.getElementById("searchBtn").addEventListener('click',function() {
      var searchinput = document.getElementById('searchbarinput').value.toLowerCase();
      var wikiapi = "https://en.wikipedia.org/w/api.php?action=query&format=json&titles="+searchinput+"&prop=extracts&exintro&origin=*";
      var EdAapi = "https://api.edamam.com/api/recipes/v2?type=public&q="+searchinput+"&app_id=5580467d&app_key=717fcc61183eb09ca933fe3ddf73c660";
      localStorage.setItem('Search-History', JSON.stringify(searchinput));
      fetchwikipedia(wikiapi);
      fetchedamam(EdAapi);
  });

  function fetchwikipedia(api) {
    fetch(api).then(function(response) {
    return response.json();
   }).then(function(data) {
       var checkweb = data.query.pages;
       var frontpage = Object.keys(checkweb)[0];
       var fetchweb = checkweb[frontpage];
      if (frontpage != "-1"&&fetchweb.hasOwnProperty("extract")&&!fetchweb.extract.includes("NewPP limit report")) {
        showhistory(fetchweb.extract);
        } else {
        showhistory("History not found"); }
    })
}

  function showhistory(data) {
      var WikiData = document.getElementById("dataret");
      WikiData.innerHTML = data; 
      history.forEach(function(htbug) {
          var section = document.createElement("section");
          section.innerHTML = htbug;
          WikiData.appendChild(section);
      });
  }

  function fetchedamam(EdAapi) {
    fetch(EdAapi, {
        method: 'GET',
        headers: {'Accept': 'application/json' }
    }).then(function(response) {
     return response.json();
    }).then(function(data) {
    displayedamam(data.hits);
    });
}

  function displayedamam(recipes) {
      var recipesection = document.getElementById("recipesection");
      recipesection.innerHTML = ""; 

      recipes.forEach(function(edamamrecipes) {
        var recipe = edamamrecipes.recipe;
        var sectionforEl = document.createElement("section");
        sectionforEl.classList.add("recipesclasslist");
    
        var images = document.createElement("img");
        images.setAttribute("src", recipe.image);
        images.setAttribute("alt", recipe.label);
        var textsection = document.createElement("section");
        textsection.classList.add("recipein");
        var Rheader = document.createElement("h2");
        Rheader.textContent = recipe.label;
        Rheader.classList.add("recipeheader");
        var ingredients = document.createElement("li");
        ingredients.textContent = recipe.ingredientLines.join(" - ");
        ingredients.classList.add("ingredients");
    
        textsection.appendChild(Rheader);
        textsection.appendChild(ingredients);
        sectionforEl.appendChild(images);
        sectionforEl.appendChild(textsection);
        recipesection.appendChild(sectionforEl);
    });
  }
 // Get rid of some noise that is displayed when data is received.
    function decodeHTMLEntities(historydata) {
      return $("<textarea/>")
        .html(historydata)
        .text(); }
    decodeHTMLEntities();
});

// Making sure functions run after HTML loads.
document.addEventListener('DOMContentLoaded', function () {
  var pagearray = [];
  var recipes = [];

  // Run fetchwikipedia/fetchedamam when button is clicked; API documentation.
  document.getElementById('searchBtn').addEventListener('click', function () {
    var searchinput = document.getElementById('searchBarInput').value.toLowerCase();
    var api = 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles=' + searchinput + '&prop=extracts&exintro&origin=*';
    var EdAapi = 'https://api.edamam.com/api/recipes/v2?type=public&q=' + searchinput + '&app_id=5580467d&app_key=717fcc61183eb09ca933fe3ddf73c660';

    fetchwikipedia(api);
    fetchedamam(EdAapi);
  });

  //API fetch request; extract data and store in an array; calling showhistory function.
  function fetchwikipedia(api) {
    fetch(api).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var infosections = data.query.pages;
          var headsec = Object.keys(infosections)[0];
          var extractpage = infosections[headsec].extract; pagearray.push(extractpage);
          showhistory(pagearray);
        });
      } else if (response.status != 200) {
        throw "Status Error";
      }
    });
  }

  // Making sure there is no prev info; create element for retrieved history; append elements so it can show on HTML.
  function showhistory(history) {
    var WikiData = document.getElementById('data');
    WikiData.textContent = '';
    for (let i = 0; i < history.length; i++) {
      var divsec = document.createElement('p');
      divsec.textContent = decodenoise(history[i]);
      WikiData.appendChild(divsec);
    }
  }

  // fetch request to Edamam website; store received responses into array; call function to display the info.
  function fetchedamam(EdAapi) {
    fetch(EdAapi, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    }).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var Rlists = data.hits;

          if (Rlists.length > 0) {
            Rlists.forEach(function (Elist) {
              var recipe = {
                label: Elist.recipe.label,
                ingredients: Elist.recipe.ingredientLines.join('\n')
              };
              recipes.push(recipe);
            })
            displayedamam(recipes);
          } else if (response.status != 200) {
            throw "Status Error";
          }
        });
      }
    });
  }

  // function to display information from array.
  function displayedamam(recipes) {
    var recipesection = document.getElementById('recipesection');
    recipesection.innerHTML = '';

    recipes.forEach(function (recipe) {
      var addrecipediv = document.createElement('div');

      // create sections for each recipe that appears when input is received.
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

      // show recipes when clicked and append recipes so it shows. Save to local storage on click.
      Recname.addEventListener('click', function () {
        if (shoplist.style.display === 'none') {
          shoplist.style.display = 'block';
        } else {
          shoplist.style.display = 'none';
        }
      });
      recipesection.appendChild(addrecipediv);
    });
  };

  // Get rid of some noise that is displayed when data is received.
  function decodenoise(historybug) {
    return $("<textarea/>")
      .html(historybug)
      .text();
  }
  decodenoise();
});


const listItem = document.createElement('li');
//Set up and display search history, clearing existing content
function updateSearchHistory() {
  var historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  listItem.innerHTML = '';
  listItem.innerHTML = JSON.parse(localStorage.getItem('Search-History'))
  historyList.appendChild(listItem);
  console.log(listItem.innerHTML);
}
updateSearchHistory();