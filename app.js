var express = require('express')
var app = express()
var routes = require("./routes")
var bodyParser = require("body-parser")
var hbs = require("hbs")
app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))


app.get("/", routes.index)

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

app.listen(3000, function(){
  console.log("app listening on port 3000")
})
