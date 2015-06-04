var bodyParser = require("body-parser")
var express = require('express')
var app = express()
var routes = require("./routes")
var hbs = require("hbs")
var User = require('./models/user.js')
var Trip = require('./models/trip.js')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/puppies')

app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.get('/login', function(req, res) {
  res.render('login')
})

app.get("/itinerary", function(req, res){
  // Trip.findById(req.body.id, function(err, trip){
  //   res.render('itinerary', {trips: trip})
  // })
  res.render('itinerary')
})

app.post('/login', function(req, res){
  var new_user = new User({
    name: req.body.name
  })
  new_user.save(function(err){
    if (err) throw err
  })
  res.render("index")
})

app.get("/", routes.index)

app.get('/users', function(req, res){
  mongoose.model('User').find(function(err, users){
    res.render('users', {users: users})
    // res.send(users)
  })
})

app.get("/results", function(req, res ){
  var origin = req.params.origin
  res.render('results', origin)
})

app.get("/flights", function(req, res){
  res.render('flights')
})

app.get("/activities", function(req, res){
  // var db = 'mongodb://localhost/puppies'
  // db.collection('trips').insert(req.data, function (err, doc) {
  //
  //   })
  res.render('activities')
})

app.post("/activities", function(req, res){
  var test = new Trip(
    req.body
  )
  test.save(function(err){
    if (err) throw err

    res.json(test)
  })



//   trip_id = req.body.trip_id
//   existing_trip = Trip.find(req)
//   var new_activity = new Activity(req.body.activity)
//   existing_trip.activites.push(new_activity)
//   existing_trip.save(function(err){
//     if (err) throw err
//     res.json(new_activity);
//   })
//
})

app.post("/trips", function(req, res){
  // Trip.findById(req.body.id, function(err, trip){
  //   res.send('itinerary', {trips: trip})
  // })
    var id = req.body.id
    res.send(id + ' ')

  // var new_trip = new Trip(
  //   req.body
  // )
  // new_trip.save(function(err){
  //   if (err) throw err
  //
  //   res.json(new_trip);
  // })
})

app.put("/activities", function(req,res){
  Trip.findByIdAndUpdate( req.body.id, {$push: {activities: req.body.data}},
  function (err, trip) {
        if (err) throw err
        console.log(trip.test)
        res.json(trip)
      }
   )

})

app.get("/activities/:id", function(req, res){
  // var id = req.params.id
  // res.render('itinerary', {trips: id})
  Trip.findById(req.params.id, function(err, trip){
    res.render('itinerary', {trips: trip})
  })
})


app.listen(3000, function(){
  console.log("app listening on port 3000")
})
