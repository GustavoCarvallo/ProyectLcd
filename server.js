var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

//Log, it is a json object as [{event: eventInfo, date: date}].
var log = [];
var logCurrentIndex = 0;

app.use(express.static('web'))

//This is the web server
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})

app.post('/log', function(req, res){
  var logEvent;
  req.on('data', function (data) {
    logEvent = JSON.parse(data.toString());
    log[logCurrentIndex] = logEvent;
    logCurrentIndex++;

    res.sendStatus(200); //Ok

    // console.log("******");
    // for (var i = 0; i < log.length; i++) {
    //   console.log(log[i].event + " " + log[i].date);
    // }
  });
});
