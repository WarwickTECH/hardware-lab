var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var app = express();

var url = 'mongodb://localhost:27017/myproject';

var db;

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
    db = database
    app.listen(process.env.PORT || 3000, () => {
      console.log('listening on 3000')
    });
});

var hardware = [
  { name : 'Arduino Uno', quantity : 10, type : "Microcontroller"},
  { name : 'KL46Z', quantity : 4, type : "Microcontroller"},
  { name : 'DE0-Nano', quantity : 2, type : "FPGA"},
];

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// app.get('/hardware/random', function(req, res) {
//   var id = Math.floor(Math.random() * hardware.length);
//   var q = hardware[id];
//   res.json(q);
// });

app.get('/hardware', function(req, res) {
  db.collection('hardware').find({}).toArray(function(err, docs) {
    res.send(docs)
  });
});

app.get('/hardware/:id', function(req, res) {
  if(req.params.id < 0) {
    res.statusCode = 404;
    return res.send('ERROR 404: No id referenced');
  }
  console.log(req.params.id)

  db.collection('hardware').findOne({'_id': new ObjectId(req.params.id)}, function(err, item) {
    if(item == null){
      res.statusCode = 404;
      return res.send('ERROR 404: No hardware found in db');
    };
    res.send(item);
    console.log(item)
  });
});

app.get('/hardware/name/:name', function(req, res) {
  if(req.params.name == null) {
    res.statusCode = 404;
    return res.send('ERROR 404: No items referenced');
  }
  console.log(req.params.name)

  db.collection('hardware').find({'name': req.params.name}).count(function(err, total) {
    if(total == 0){
      res.statusCode = 404;
      return res.send('ERROR 404: No hardware found in db');
    };
    console.log(total)
    res.json(total)
  });
});

app.get('/hardware/status/:id', function(req, res) {
  if(req.params.id < 0) {
    res.statusCode = 404;
    return res.send('ERROR 404: No id referenced');
  }
  console.log(req.params.id)

  db.collection('hardware').findOne({'_id': new ObjectId(req.params.id)}, function(err, item) {
    if(item == null){
      res.statusCode = 404;
      return res.send('ERROR 404: No hardware found in db');
    };
    res.send(item.status);
    console.log(item)
  });
});

// app.put('/hardware/:id', function(req, res) {
//
// });


app.post('/hardware', function(req, res) {
  if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('type')) {
    res.statusCode = 400;
    return res.send('ERROR 400: Post syntax incorrect.');
  }

  var newHardware = {
    name : req.body.name,
    type : req.body.type,
    status : false,
    studentId : null,
    studentEmail : null
  };

  db.collection('hardware').insert(newHardware, {w:1}, function(err, result) {});
  console.log("Successfully added hardware")
  res.statusCode = 200;
  res.send("HTTP 200: Successful");
});




app.delete('/hardware/:id', function(req, res) {
  if(hardware.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No hardware found');
  }

  hardware.splice(req.params.id, 1);
  res.json(true);
});
