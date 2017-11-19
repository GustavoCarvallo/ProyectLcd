var express = require('express');
var app = express();
var http = require('http').Server(app);
//var bodyParser = require('body-parser');
var fs = require('fs');

//Log, it is an array of json object as [{event: eventInfo, date: date}].
var log = [];

/**
 * This method load all the previous logs written into log.json.
 */
function loadLog(){
  fs.readFile('log.json', 'utf8', function (err,data) {
      if (err) {
        // return console.log(err);
        return;
      }
      if (data.length>0){
        log = JSON.parse(data)
      }
  });
}

/**
 * This method writes a new log into the file log.json.
 */
function writeNewLog(logEvent){
  fs.readFile('log.json', function (err, text) {
    var json;

    if(err){ //If there is no log.json file, create a new one.
      json = [];
      json.push(logEvent);

    }
    else { //There is a log.json, so add the new log to that file.
      json = JSON.parse(text);
      json.push(logEvent);
    }

    fs.writeFile("log.json", JSON.stringify(json), function(err){
        if (err) throw err;
    });
  });
}

app.use(express.static('web'))

//This is the web server
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   loadLog();

   console.log("Example app listening at http://%s:%s", host, port)
});

app.post('/log', function(req, res){
  req.on('data', function (data) {
    var logEvent = JSON.parse(data.toString());
    log.push(logEvent);
    writeNewLog(logEvent);

    res.sendStatus(200); //Ok
  });
});

app.get('/log', function(req, res){
  res.json(log);
})

app.get('/download', function(req, res){
  var file = 'log.json';
  res.download(file); // Set disposition and send it.
});

app.post('/deleteAllLog', function (req, res) {
  fs.unlink("log.json", function(err){
    if(err) return;
    else{
      log = [];
      res.sendStatus(200); //Ok
    }
  })
});
