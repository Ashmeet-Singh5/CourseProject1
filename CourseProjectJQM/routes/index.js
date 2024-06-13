const { setDefaultResultOrder } = require('dns');
var express = require('express');
var router = express.Router();

let  serverArray = [];

let booking = function (pFirstName, pLastName, pCarMake, pCarModel, pDetail, pCeramic) {
    this.FirstName = pFirstName;
    this.LastName = pLastName;
    this.FullName = this.FirstName + " " + this.LastName;
    this.CarMake = pCarMake;
    this.CarModel = pCarModel;
    this.Detail = pDetail;
    this.Ceramic = pCeramic;
    this.ID = serverArray.length;

}

var fs = require("fs");

let fileManager = {
  read: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    serverArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(serverArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

if(!fileManager.validData())
{
serverArray.push(new booking("John", "Hornes", "GMC", "Denali", "Silver Detail", "Basic Ceramic"))
serverArray.push(new booking("Alexander", "York", "Nissan", "Armada", "Gold Detail", "Premium Ceramic"))
serverArray.push(new booking("Iman", "Gadhzi", "Ferrai", "488 Pista", "Platinum Detail", "Deluxe Ceramic"))
serverArray.push(new booking("Steve", "Varsano", "Cadillac", "Escallade", "Gold Detail", "Deluxe Ceramic"))
fileManager.write();
}
else{
  fileManager.read();
}

console.log(serverArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all Booking data */
router.get('/getAllBookings', function(req, res) {
  fileManager.read();
  res.status(200).json(serverArray);
});

/* Add one new booking */
router.post('/AddMovie', function(req, res) {
  const newBook = req.body;
  console.log(newBook)
  serverArray.push(newBook);
  fileManager.write();
  res.status(200).json(newBook);
});

//add route for delete
router.delete('/DeleteBooking/:ID', (req, res) => {
  const delID = req.params.ID;
  let found = false;
  let pointer = GetArrayPointer(delID);
  if(pointer == 1){
    console.log("not found");
    return res.status(500).json({
      status: "error - no such ID"
    });
  }
  else {
    serverArray.splice(pointer, 1);
    fileManager.write();
    res.send('Movie with ID: ' + delID + ' deleted!')
  }
});

function GetArrayPointer(localID) {
  for (let i = 0; i < serverArray.length; i++) {
    if (localID === serverArray[i].ID) {
      return i;
    }
  }
}

module.exports = router;
