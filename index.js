var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

console.log(__dirname)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var url = 'mongodb://localhost:27017/myproject';
var db;
var randomHard;

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
    db = database
    app.listen(process.env.PORT || 3000, () => {
      console.log('listening on 3000')
    });
});

// HOME

app.get('/', function(req, res){
    db.collection('hardware').count(function(err, totalinDb) {
      var randomNum = Math.floor((Math.random() * totalinDb) + 1);
      db.collection('hardware').distinct("name",{ "status": false }, function(err,names){
        db.collection('hardware').find().skip(randomNum - 1).limit(-1).next(function(err,random) {
          // console.log(docs)
          renderHome(res, names, random.name);
        });
      });
      function renderHome(res, names, itemName) {
        console.log(names);
        res.render('home', {
              renderHardware: itemName,
              availableHardware: names
          });
      }
    });
});


// HARDWARE (ALL) END POINT
// Get all hardware, available or not

app.route('/hardware')
  .get(function(req, res) {
	if(req.query.status != null){
		console.log(req.query.status);
	}
    if(req.query.status == 'true') {
      console.log('trigger')
      db.collection('hardware').find({status : true}).toArray(function(err, docs) {
        res.send(docs)
      });
    }
    else if(req.query.status == 'false'){
      db.collection('hardware').find({status : false}).toArray(function(err, docs) {
        res.send(docs)
      });
    }
    else {
      db.collection('hardware').find({}).toArray(function(err, docs) {
        res.send(docs)
      });
    }
  })
  .post(function(req, res) {
    if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('type')) {
      res.statusCode = 400;
      return res.send('ERROR 400 - Post syntax incorrect.');
    }

    var newHardware = {
      name : req.body.name,
      type : req.body.type,
      status : false,
      studentId : null,
      studentEmail : null,
      dateLoaned : null
    };

    db.collection('hardware').insert(newHardware, {w:1}, function(err, result) {});
    console.log("Successfully added hardware ")
    res.statusCode = 200;
    res.send("HTTP 200 - Successful");
  });

// ID END POINT
// Get specific item in the hardware store

app.route('/hardware/:id')
  .get(function(req, res) {
    if(req.params.id < 0) {
      res.statusCode = 404;
      return res.send('ERROR 404 - No id referenced');
    }
    console.log(req.params.id)

    db.collection('hardware').findOne({'_id': new ObjectId(req.params.id)}, function(err, item) {
      if(item == null){
        res.statusCode = 404;
        return res.send('ERROR 404 - No hardware found in db');
      };
      res.send(item);
      console.log(item)
    });
  })
  .delete(function(req, res) {
    if(req.params.id == null) {
      res.statusCode = 404;
      return res.send('Error 404 - No hardware found');
    }

    db.collection('hardware').deleteOne({'_id': new ObjectId(req.params.id)}, function(err, result) {
      res.statusCode = 200;
      return res.send('HTTP 200 - Hardware ' + req.params.id + ' removed');
    });
  });

// NAME END POINT
// Check how many of a specific hardware that we have in total

app.get('/hardware/name/:name', function(req, res) {
  if(req.params.name == null) {
    res.statusCode = 404;
    return res.send('ERROR 404 - No items referenced');
  }
  console.log(req.params.name)

  db.collection('hardware').find({'name': req.params.name}).count(function(err, total) {
    if(total == 0){
      res.statusCode = 404;
      return res.send('ERROR 404 - No hardware found in db');
    };
    console.log(total)
    res.json(total)
  });
});

// STATUS END POINT
// Check if a device is currently being borrowed

app.route('/hardware/status/:id')
  .get(function(req, res) {
    if(req.params.id < 0) {
      res.statusCode = 400;
      return res.send('ERROR 400 - No id referenced');
    }
    console.log(req.params.id)

    db.collection('hardware').findOne({'_id': new ObjectId(req.params.id)}, function(err, item) {
      if(item == null){
        res.statusCode = 400;
        return res.send('ERROR 400 - No hardware found in db');
      };
      res.send(item.status);
      console.log(item)
    });
  })

  .put(function(req, res){
    if(req.params.id < 0 || req.body == null) {
      res.statusCode = 400;
      return res.send('ERROR 400 - id or status not referenced');
    }

    console.log(req.body.status)

    var isTrueSet = (req.body.status === 'true'); // Defaults to false if incorrect value pushed
    var emailStudent;
    var idStudent;
    var dateLoaned = new Date();

    if(isTrueSet == true){
      try {
        emailStudent = req.body.studentEmail;
        idStudent = req.body.studentId;
      }
      catch(err){
        res.statusCode = 400;
        return res.send('ERROR 400 - Incorrect Syntax: Missing email and/or id');
      }
    }
    else if(isTrueSet == false){
      emailStudent = null;
      idStudent = null;
      dateLoaned = null;
    };

    db.collection('hardware').findAndModify({'_id': new ObjectId(req.params.id)}, [], { $set: {"status": isTrueSet, "studentId": emailStudent, "studentEmail": idStudent, "dateLoaned": dateLoaned} }, { new : true}, function(err, item) {
      if(item == null){
        res.statusCode = 400;
        return res.send('ERROR 400 - No hardware with id found in db');
      };
      res.send(item);
    });
  })

// app.get('/hardware/random', function(req, res) {
//   var id = Math.floor(Math.random() * hardware.length);
//   var q = hardware[id];
//   res.json(q);
// });
