var bodyParser = require("body-parser")
var express = require('express')
var app = express()
var routes = require("./routes")
var hbs = require("hbs")
var User = require('./models/user.js')
var Trip = require('./models/trip.js')
var mongoose = require('mongoose')
var http = require('http')
var port = Number(process.env.PORT || 3000)
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/travelPlanner'
mongoose.connect(mongoUri)

app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// future login route once I find a good User authentication option //
// app.post('/login', function(req, res){
//   var new_user = new User({
//     name: req.body.name
//   })
//   new_user.save(function(err){
//     if (err) throw err
//   })
//   res.render("index")
// })

// landing page for time being until I integrate flight search //
app.get("/", function(req, res ){
  res.render('activities')
})

// meant for when I finalize user setup //
// app.get('/users', function(req, res){
//   mongoose.model('User').find(function(err, users){
//     res.render('users', {users: users})
//   })
// })

// will show flight search results //
app.get("/results", function(req, res ){
  var origin = req.params.origin
  res.render('results', origin)
})

app.get("/flights", function(req, res){
  res.render('flights')
})

app.get("/activities", function(req, res){
  res.render('activities')
})

app.post("/activities", function(req, res){
  var new_trip = new Trip(
    req.body
  )
  new_trip.save(function(err){
    if (err) throw err
    res.json(new_trip)
  })

})

app.post("/trips", function(req, res){
  // Trip.findById(req.body.id, function(err, trip){
  //   res.send('itinerary', {trips: trip})
  // })
    var id = req.body.id
    res.send(id + ' ')

})

app.put("/activities", function(req,res){
  Trip.findByIdAndUpdate( req.body.id, {$push: {activities: req.body.data}},
  function (err, trip) {
        if (err) throw err
        res.json(trip)
      }
   )

})

app.get("/activities/:id", function(req, res){
  Trip.findById(req.params.id, function(err, trip){
    res.render('itinerary', {trips: trip})
  })
})

app.listen(port)

// app.listen(3000, function(){
//   console.log("app listening on port 3000")
// })
