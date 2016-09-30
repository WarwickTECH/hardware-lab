var express = require('express');
var app = express();
var expressHbs = require('express-handlebars');

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.get('/', function(req, res){
  res.render('home');
});

app.get('/simple', function(req, res){
  var data = {name: 'Gorilla'};
  res.render('simple', data);
});

var body = { "hardware":{
  "dev_kits" : {
    1 : {
      "quantity" : 10,
      "type" : "Arduino"
    },
    2 : {
      "quantity" : 20,
      "type" : "Freedom Board"
    }
  }
}}

app.get('/api', function(req, res){
  res.json(
    body
  )
})

app.put('/api', function(req,res){
  req.json(

  )

})

app.listen(3000);
