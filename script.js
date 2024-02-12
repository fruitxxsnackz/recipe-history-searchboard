document.addEventListener("DOMContentLoaded",function() {
  var history = [];
  var dropdownmenu = document.getElementById('dropdownmenu');

  document.getElementById("searchBtn").addEventListener('click',function() {
      var searchinput = document.getElementById('searchbarinput').value.toLowerCase();
      var wikiapi = "https://en.wikipedia.org/w/api.php?action=query&format=json&titles="+searchinput+"&prop=extracts&exintro&origin=*";
      var EdAapi = "https://api.edamam.com/api/recipes/v2?type=public&q="+searchinput+"&app_id=5580467d&app_key=717fcc61183eb09ca933fe3ddf73c660";

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