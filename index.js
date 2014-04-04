var express = require('express');
var app = express();
var port = 3700;

// jade stuff
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

// static resources
app.use(express.static(__dirname + '/public'));
app.get("/", function(req, res) {
  res.render('page');
  //res.send("It works!");
});

app.listen(port);
console.log('Listenintg on ' + port);
