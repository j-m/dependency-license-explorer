var whitelist = [],
    blacklist = [],
    synonyms = [];

function get_file(url, callback) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.send();
}
get_file("config/whitelist.txt", function (response) {
    whitelist = response.split('\n').filter(line => line.length > 0);
    console.log(response);
});
get_file("config/blacklist.txt", function (response) {
    blacklist = response.split('\n').filter(line => line.length > 0);
    console.log(response);
});
get_file("config/synonyms.txt", function (response) {
    synonyms = response.split('\n').filter(line => line.length > 0);
    console.log(response);
});