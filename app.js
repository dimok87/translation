var express = require('express');
var app = express();

var redis = require("redis"),
    client = redis.createClient();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

client.on("error", function (err) {
    console.log("Error " + err);
});

var translations = {};

/*translations = {
    "menu.catchup": "TV na życzenie",
    "menu.channels": "Kanały TV",
    "menu.guide": "Program TV",
    "menu.home": "Start",
    "menu.live": "TV",
    "menu.login": "Zaloguj",
    "menu.logout": "Wyloguj",
    "menu.reminders": "Przypomnienia",
    "menu.myvideos": "Moje zamówienia",
    "menu.menu": "Menu",
    "menu.search": "Wyszukaj",
    "menu.series": "Seriale",
    "menu.settings": "Ustawienia",
    "menu.shop": "Pakiety",
    "menu.svod": "Subskrypcje",
    "menu.tvod": "Filmy",
    "menu.movies": "Filmy",
    "menu.faq": "FAQ",
    "menu.terms": "O usłudze",
    "menu.pages": "Wybrane",
    "menu.purchases": "Moje zakupy",
    "menu.wishes": "Wybrane",
    "menu.purchase-history": "Historia zakupów",
    "menu.coupons": "Kupony",
    "about.app_id": "Identyfikator",
	"about.header": "O aplikacji",
	"about.ip_address": "Publiczny adres IP",
	"about.network_type": "Rodzaj połączenia",
	"about.equipment": "Urządzenie",
	"about.equipment_version": "Wersja urządzenia",
	"about.username": "Nazwa użytkownika",
	"about.version": "Wersja", 
};
client.set("translation", JSON.stringify(translations));*/

client.get("translation", function(err, reply) {
    translations = JSON.parse(reply);
});

app.get('/translations', function (req, res) {
    client.get("translation", function(err, reply) {
        res.json(translations);
    });
});

app.post('/save', function (req, res) {

    var isChanged = false;

    for (var translationKey in req.body) {
        if (translations[translationKey] && translations[translationKey] != req.body[translationKey]) {
            translations[translationKey] = req.body[translationKey];
            isChanged = true;
        }
    }

    if (isChanged) {
        client.set("translation", JSON.stringify(translations));
    }

    res.json(translations);
});

app.listen(3030, function () {
  console.log('App listening on port 3030!');
});
