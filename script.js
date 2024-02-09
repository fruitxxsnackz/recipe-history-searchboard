
document.addEventListener('DOMContentLoaded', function() {
    var pagearray = [];

    document.getElementById('searchBtn').addEventListener('click', function () {
        var searchinput = document.getElementById('searchBarInput').value.toLowerCase();
        var api = 'https://en.wikipedia.org/w/api.php?action=query&format=json&titles='+searchinput+'&prop=extracts&exintro&origin=*';

        fetchWikipedia(api);
    });

    function fetchWikipedia(api) {
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