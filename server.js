var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

//Log, it is an array of json object as [{event: eventInfo, date: date}].
var log = [];
var logCurrentIndex = 0;

var fs = require('fs');

var lyrics = 'But still I\'m having memories of high speeds when the cops crashed\n' +
    'As I laugh, pushin the gas while my Glocks blast\n' +
    'We was young and we was dumb but we had heart';



app.use(express.static('web'))

//This is the web server
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
    fs.readFile('log.json', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
        if (data.length>0){
        log = JSON.parse(data)
        }
        fs.writeFile('log.txt',JSON.stringify(log), function(err){
            if(err) throw err
        });
        });

   console.log("Example app listening at http://%s:%s", host, port)
})

app.post('/log', function(req, res){
    var logEvent;
  req.on('data', function (data) {
    logEvent = JSON.parse(data.toString());
      log.push(logEvent)
      fs.readFile('log.json', function (err, text) {
          var json = JSON.parse(text);
          json.push(logEvent);
          fs.writeFile("log.json", JSON.stringify(json), function(err){
              if (err) throw err;
          });
      });
    res.sendStatus(200); //Ok
  });
});



app.get('/log', function(req, res){
  res.json(log);
})

app.get('/download', function(req, res){
  var file = __dirname + 'log.txt';
  res.download(file); // Set disposition and send it.
});
