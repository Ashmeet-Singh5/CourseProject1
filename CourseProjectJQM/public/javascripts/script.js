let  bookingArray = [];

let booking = function (pFirstName, pLastName, pCarMake, pCarModel, pDetail, pCeramic) {
    this.FirstName = pFirstName;
    this.LastName = pLastName;
    this.FullName = this.FirstName + " " + this.LastName;
    this.CarMake = pCarMake;
    this.CarModel = pCarModel;
    this.Detail = pDetail;
    this.Ceramic = pCeramic;
    this.ID = bookingArray.length;

}

//bookingArray.push(new booking("John", "Hornes", "GMC", "Denali", "Silver Detail", "Basic Ceramic"))
//bookingArray.push(new booking("Alexander", "York", "Nissan", "Armada", "Gold Detail", "Premium Ceramic"))
//bookingArray.push(new booking("Iman", "Gadhzi", "Ferrai", "488 Pista", "Platinum Detail", "Deluxe Ceramic"))
//bookingArray.push(new booking("Steve", "Varsano", "Cadillac", "Escallade", "Gold Detail", "Deluxe Ceramic"))

let selectedDetail = "not selected";
let selectedCeramic = "not selected";

document.addEventListener("DOMContentLoaded", function(event) {

    createList();

    document.getElementById("buttonBook").addEventListener("click", function() {

        let newBook = new booking(document.getElementById("fName").value, 
        document.getElementById("lName").value,
        document.getElementById("carMake").value, 
        document.getElementById("carModel").value,
        selectedDetail, 
        selectedCeramic);

        $.ajax({
            url : "/AddMovie",
            type: "POST",
            data: JSON.stringify(newBook),
            contentType: "application/json; charset=utf-8",
            dataType    : "json",
            success: function (result){
                console.log(result);
                document.location.href = "index.html#Booked"
            }
            
        });
    });

    document.addEventListener("change", function(event) {
        if(event.target.id === "select-detail"){
            selectedDetail = event.target.value;
        }
    });

    document.addEventListener("change", function(event) {
        if(event.target.id === "select-ceramic"){
            selectedCeramic = event.target.value;
        }
    });

    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("fName").value = "";
        document.getElementById("lName").value = "";
        document.getElementById("carMake").value = "";
        document.getElementById("carModel").value = "";
    });

    $(document).on("pagebeforeshow", "#Booked", function (event) { createList();

    });

    document.getElementById("delete").addEventListener("click", function (){
        let localParm = localStorage.getItem('parm');
        deleteMovie(localParm);
    });

    document.getElementById("buttonSortDetail").addEventListener("click", function(){
        bookingArray.sort(dynamicSort("Detail"));
        createList();
        document.location.href = "index.html#Booked";
    });

    document.getElementById("buttonSortCeramic").addEventListener("click", function() {
        bookingArray.sort(dynamicSort("Ceramic"));
        createList();
        document.location.href = "index.html#Booked";
    });

    $(document).on("pagebeforeshow", "#Details", function (event) {
        let localID = localStorage.getItem('parm');

        bookingArray = JSON.parse(localStorage.getItem('bookingArray'));

        console.log(localID);
        document.getElementById("nameFirst").innerHTML = "<b>First Name: </b>" + bookingArray[localID].FirstName;
        document.getElementById("nameLast").innerHTML = "<b>Last Name: </b>" + bookingArray[localID].LastName;
        document.getElementById("Make").innerHTML = "<b>Car Make: </b>" + bookingArray[localID].CarMake;
        document.getElementById("Model").innerHTML = "<b>Car Model: </b>" + bookingArray[localID].CarModel;
        document.getElementById("detailPack").innerHTML = "<b>Detail Package: </b>" + bookingArray[localID].Detail;
        document.getElementById("ceramicPack").innerHTML = "<b>Ceramic Package: </b>" + bookingArray[localID].Ceramic;
    });

});

function createList(){

$.get("/getAllBookings", function(data, status){
    console.log(status);
    bookingArray = data;


    let theBooked = document.getElementById("myul");
    theBooked.innerHTML = "";

    bookingArray.forEach(function(element) {
        var myLi = document.createElement('li');
        myLi.classList.add('oneBook');
        myLi.innerHTML = element.FullName + ", " + element.Detail + ", " + element.Ceramic;

        myLi.setAttribute("data-parm", element.ID);

        theBooked.appendChild(myLi);
    });

    let liBook = document.getElementsByClassName("oneBook");
    let newBookArray = Array.from(liBook);

    newBookArray.forEach(function (element) {
        element.addEventListener('click', function() {

            let parm = this.getAttribute("data-parm");

            localStorage.setItem('parm', parm);

            let stringBookingArray = JSON.stringify(bookingArray);
            localStorage.setItem('bookingArray', stringBookingArray);

            document.location.href = "index.html#Details";
        });
    });
});

}

function dynamicSort(property){
    console.log('Sort Success');
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}

function deleteMovie(which) {
    console.log(which);

    $.ajax({
        type: "DELETE",
        url: "/DeleteBooking/" + which,
        success: function(result){
            console.log(result + " back form delete on server");
            document.location.href = "index.html#Booked";
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log(textStatus);
            alert("server failed to delete");
        }

    })
}