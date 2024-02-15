// Function ensures content is loaded before running any code.
document.addEventListener("DOMContentLoaded",function() {
  var modal = document.getElementById("edamodal");
  var nutrm = document.getElementsByClassName("exitbox")[0];
  // Popup modal after 30 sec.
  setTimeout(function() {
    document.getElementById('edamodal').style.display = 'block';
  }, 30000); 
  nutrm.onclick = function() {
    modal.style.display = "none"; }
  window.onclick = function(event) {
    if (event.target = modal) {
      modal.style.display = "none"; }
  }
  var history = [];
 //  when you click on the search button, the input from searchbutton is taken; setting API url's; call fetching functions.
  document.getElementById("searchBtn").addEventListener('click',function() {
      var searchinput = document.getElementById('searchbarinput').value.toLowerCase();
      var wikiapi = "https://en.wikipedia.org/w/api.php?action=query&format=json&titles="+searchinput+"&prop=extracts&exintro&origin=*";
      var EdAapi = "https://api.edamam.com/api/recipes/v2?type=public&q="+searchinput+"&app_id=5580467d&app_key=717fcc61183eb09ca933fe3ddf73c660";
      fetchwikipedia(wikiapi);
      fetchedamam(EdAapi);
  });
 //  Fetch data from wikipedia; check for history page; run function to show data.
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
 //  Shows data received from wikipedia; gets element in html and puts data in there.
  function showhistory(data) {
      var WikiData = document.getElementById("dataret");
      WikiData.innerHTML = data;
      history.forEach(function(htbug) {
       var section = document.createElement("section");
       section.innerHTML = htbug;
      WikiData.appendChild(section);
      });
  }
 //  Fetch data from Edamam; call functions to show data.
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
 //  function to display data; add elements in which I can put data into.
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
      var ingredients = document.createElement("ul");
      recipe.ingredientLines.forEach(function(ingredient) {
        var li = document.createElement("li");
        li.textContent = ingredient;
        ingredients.appendChild(li); 
      });
      textsection.appendChild(Rheader);
      textsection.appendChild(ingredients);

      // instructions and a link to the third-party site for these recipes
      var instructions = document.createElement("p");
      if (recipe.url) {
        var instrucedamam = document.createElement("a");
        instrucedamam.setAttribute("href", recipe.url);
        instrucedamam.setAttribute("target", "_blank");
        instrucedamam.textContent = "Click to view full recipe on third-party site.";
        instrucedamam.style.fontWeight = "bold";
        instructions.appendChild(instrucedamam); }
      // append data to webpage
      textsection.appendChild(instructions);
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

 //Local Storage Section

 var clickedSearchTerm = '';
 // Get the input element
var searchBarInput = document.getElementById('searchbarinput');

// Add an event listener to the search button to save input value to local storage
document.getElementById('searchBtn').addEventListener('click', function() {
   saveToLocalStorage(searchBarInput.value);
   updateSearchHistory();
 });

 function saveToLocalStorage(searchBarInputvalue) {
   let history = JSON.parse(localStorage.getItem('searchBarInput')) || [];
   history.push(searchBarInputvalue);
   localStorage.setItem('searchBarInput', JSON.stringify(history));
   updateSearchHistory();
}

function clearSearchHistory() {
   localStorage.removeItem('searchBarInput');
   updateSearchHistory(); // Update the displayed search history
 }

 //Set up and display search history, clearing existing content
 function updateSearchHistory() {
   var historyList = document.getElementById('historyList');
   var searchHistorySection = document.getElementById('searchHistory');
  
   //Retrieve search history from local storage
   var history = JSON.parse(localStorage.getItem('searchBarInput')) || [];

   historyList.innerHTML = '';
  
     // Add search history list items
     if (history.length > 0) {
       searchHistorySection.style.display = 'block'; // Show the search history section
       history.forEach(function(searchTerm) {
         var historyListItem = document.createElement('li');
         historyListItem.textContent = searchTerm;
      // Modify the event listener to show a prompt when a search term is clicked    
     historyListItem.addEventListener('click', function() {
      var confirmSearch = confirm("" + searchTerm + " has been added to your search bar!");
      if (confirmSearch) {
          searchBarInput.value = searchTerm;
          clickedSearchTerm = searchTerm; // Store clicked search term
          window.scrollTo(0, 0); // Scroll to the top of the page
        }
     });
         historyList.appendChild(historyListItem);
       });
     } else {
       searchHistorySection.style.display = 'none'; // Hide the search history section
   }
   }

 // Call the function to update search history
 updateSearchHistory();

// Event listener to detect when the local storage is cleared
window.addEventListener('storage', function(event) {
   if (event.key === 'searchBarInput' && event.newValue === null) {
     clearSearchHistory(); // Call clearSearchHistory when the local storage is cleared
   }
 });
