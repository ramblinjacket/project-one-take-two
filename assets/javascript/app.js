var partyLatitude;
var partyLongitude;
var FBuser;
var partyIDtoJoin;

function initPage() {
  $('.party-join').show();
  $('.party-view').hide();
}
function viewParty() {
  $('.party-join').hide();
  $('.party-view').show();
}

    function postComment() {
         FB.ui(
            {
            method: 'share',
            href: 'https://swarae.homuncul.us/'
        }, function(response){});
    }
    function getFBUser () {    
        $.ajax({            
            url: "https://swarae.homuncul.us/profile",
            method: 'GET'
            }).done(function(response) {
                console.log(response);
                FBuser = response;
                $('#organizer').html(FBuser.displayName);
            });

      };

      function decodeEntities(encodedString) {
   var textArea = document.createElement('textarea');
   textArea.innerHTML = encodedString;
   return textArea.value;
}

$(document).ready(function(){
  initPage();
  window.fbAsyncInit = function() {
    FB.init({
        appId      : '139005159958824',
        xfbml      : true,
        version    : 'v2.8'
        });
    getFBUser();
    };

    $("#facebook_button").on("click", function() {
        postComment();
    });

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk')); 


var config = {
    apiKey: "AIzaSyDEfuehrA2ZBZvZFFFdKueQVh0ZK-VDTrQ",
    authDomain: "projectonetake2.firebaseapp.com",
    databaseURL: "https://projectonetake2.firebaseio.com",
    storageBucket: "projectonetake2.appspot.com",
    messagingSenderId: "44553077304"
  };
firebase.initializeApp(config);

var database = firebase.database();

var partyname = "";
var longitude = "";
var latitude = "";



$("#save_party").on("click", function(event){
    event.preventDefault();
    viewParty();
    partyname = $("#partyname").val().trim();
    if (partyname === "") {
      alert("Please enter party name");
    } 
    else {
        personsName = FBuser.displayName;

        database.ref('/parties').push({
        partyname: partyname,
        longitude: partyLongitude,
        latitude: partyLatitude,
        organizer: personsName
      })
    }
    // longitude = $("#partylongitude").val().trim();
    // latitude = $("#partylatitude").val().trim();
    

})

var databaseref;

// $("#join_party").on("click", function(event){
//     event.preventDefault();
//     partyID = partyIDtoJoin;
//     personsName = $("#attendee").val().trim();
//     databaseref = "/parties/" + partyID + "/attendees"
//     console.log('Try join party');
//     database.ref(databaseref).push({
//       name: personsName

      
//     })

//     // partyname = $("#partyname").val().trim();
//     // longitude = $("#partylongitude").val().trim();
//     // latitude = $("#partylatitude").val().trim();

//     // database.ref('/parties').push({
//     //   partyname: partyname,
//     //   longitude: longitude,
//     //   latitude: latitude
//     // })
// })

var location = {};

database.ref('/parties').on("child_added", function(getmarker){
  var markerlongitude = parseFloat(getmarker.val().longitude);
  var markerlatitude = parseFloat(getmarker.val().latitude);
  var party = getmarker.val().partyname;
  var id =getmarker.key;
  console.log("KEY:", getmarker.key);
  //***
  var test1 = getmarker.val();
  var test2 = Object.keys(test1);
  console.log("This is test1:");
  console.log(test1);
  console.log("This is test2:");
  console.log(test2);

  //***
  console.log(getmarker); 
  console.log("The longitude is: " + markerlongitude); 
  console.log("The latitude is: " + markerlatitude); 
  console.log("The party name is: " + party);
  location = {lat: markerlatitude , lng: markerlongitude};
  console.log(location);
  //addMarkerWithTimeout(location, 500);

  var marker = new google.maps.Marker({
          position: location,
          map: map,
          party: party,
          key: id,
          label: party,
          animation: google.maps.Animation.DROP
        });
  marker.addListener('click', function(getpin){
    viewParty();
    $("#partyAttendees").html("");
    //console.log(marker.getPosition());
    console.log(marker.party);
    console.log(getpin);
    partyIDtoJoin = marker.key;
    console.log(partyIDtoJoin);

            partyID = partyIDtoJoin;
            personsName = FBuser.displayName;
            databaseref = "/parties/" + partyID + "/attendees"
            console.log('Try join party');
            database.ref(databaseref).push({
              name: personsName
            })

    database.ref("parties/"+partyIDtoJoin+"/attendees").on("value", function(getattendees){
    var attendee = getattendees.val();
    console.log("Attendee equals: ");
    console.log(attendee);
    Object.keys(attendee).forEach(function(person) {
    console.log(attendee[person].name);



    $("#partyAttendees").append("<tr><td>" + attendee[person].name + "</td></tr>");

  });

  });
})


  //console.log(attendeeID);
});
   
var map;
var markersArray = [];
// var loactionArray = [
//   {lat: 33.776140, lng:-84.389477}, //Home
//   {lat: 33.786235, lng:-84.384155},//Opera Night Club
//   {lat: 33.788566, lng:-84.368405},//Loca Luna
//   {lat: 33.772704, lng:-84.385581},//The Fox Theatre
//   {lat: 33.758748, lng: -84.391365},//The Tabernacle
//   {lat: 33.789235, lng: -84.372752},//Atlanta Botanical Garden
//   {lat: 33.781006, lng: -84.392771},//McCamish Pivilion
//   {lat: 33.772557, lng: -84.392878}//Bobby Dodd Stadium
// ];

function initialize() {
  var mapOptions = {
	zoom: 14,
	center: {lat: 33.776140, lng:-84.389477} //home
  };




  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions );
  var dropControlDiv = document.createElement('div');
  var centerControlDiv = document.createElement('div');//CENTER
  var dropControl = new DropControl(dropControlDiv); 
  // map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(dropControlDiv);
  var centerControl = new CenterControl(centerControlDiv);
  var panControlDiv = document.createElement('div');
  var panControl = new PanControl(panControlDiv);
  // map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(panControlDiv);
 /* 
var contentString = '<div style="font-family: Roboto,Arial,sans-serif; line-height: 14px;">' + 
            '<div style="font-size: 20px; font-weight: 400; line-height: 24px;">GT Global Learning Center' + 
            '</div>' + 
            '<div><img src="https://pe.gatech.edu/sites/default/files/Midtown-Global-Learning-Center.JPG" />' + 
            '</div>' + 
            '<div style="font-size: 14px; font-weight: 400; line-height: 16px;">Atlanta, GA 30308 - <a href="https://pe.gatech.edu/global-learning-center"/>pe.gatech.edu/</a>' + 
            '</div>' + 
            '</div>';


  var infowindow = new google.maps.InfoWindow({
    content: contentString,
  position: {lat: 33.776140, lng:-84.389477}//Home
  }); 
  infowindow.open(map);

  var marker = new google.maps.Marker({
    position : {lat: 33.776140, lng:-84.389477},
    map: map,
    draggable : true
  });
  marker.addListener('click', function(){
  map.setZoom(map.getZoom() + 1);
  });
  marker.addListener('rightclick', function(){
  map.setZoom(map.getZoom() - 1);
  });
*/

google.maps.event.addDomListener(window, 'load', initialize);





};

 
// function dropMarkers() {
//   clearMarkers();
//   for (var i = 0; i < loactionArray.length; i++) {
//     addMarkerWithTimeout(loactionArray[i], i * 500);
//     console.log(loactionArray[i]);
//   }
// };


function clearMarkers() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
};

function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(function() {
    markersArray.push(new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    }));
  }, timeout);
};

function DropControl(controlDiv) {
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#CB2027';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '5px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.width = '160px';
  controlUI.style.marginTop = '0px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Drop the markers';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.color = '#fff';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Find Partay';
  controlUI.appendChild(controlText);

  // controlUI.addEventListener('click', function() {
	// dropMarkers();
  // });
};

function CenterControl(controlDiv) {
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#3b5998';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.width = '120px';
  controlUI.style.marginBottom = '0px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.color = '#fff';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Home';
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', function() {
    map.setCenter({lat: 33.776140, lng:-84.389477});
  });
};
google.maps.event.addDomListener(window, 'load', initialize);

function PanControl(controlDiv){
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '1px solid #aaa';
  controlUI.style.borderRadius = '50%';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.width = '80px';
  controlUI.style.height = '80px';
  controlUI.style.margin = '10px';
  controlUI.style.backgroundImage = 'url("data:image/png;base64,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")';
  controlDiv.appendChild(controlUI);

  var controlPanUp = document.createElement('div');
  controlPanUp.title = 'Pan up';
  controlPanUp.style.backgroundColor = 'transparent';
  controlPanUp.style.position = 'relative';
  controlPanUp.style.width = '36px';
  controlPanUp.style.height = '36px';
  controlPanUp.style.cursor = 'pointer';
  controlPanUp.style.top =  '0px';
  controlPanUp.style.left =  '22px';
  controlPanUp.addEventListener('click', function() {
    map.panBy(0, -320);
  });
  controlUI.appendChild(controlPanUp);

  var controlPanDown = document.createElement('div');
  controlPanDown.title = 'Pan down';
  controlPanDown.style.backgroundColor = 'transparent';
  controlPanDown.style.position = 'relative';
  controlPanDown.style.width = '36px';
  controlPanDown.style.height = '36px';
  controlPanDown.style.cursor = 'pointer';
  controlPanDown.style.top =  '8px';
  controlPanDown.style.left =  '22px';
  controlPanDown.addEventListener('click', function() {
    map.panBy(0, 320);
  });
  controlUI.appendChild(controlPanDown);

  var controlPanLeft = document.createElement('div');
  controlPanLeft.title = 'Pan left';
  controlPanLeft.style.backgroundColor = 'transparent';
  controlPanLeft.style.position = 'relative';
  controlPanLeft.style.width = '36px';
  controlPanLeft.style.height = '36px';
  controlPanLeft.style.cursor = 'pointer';
  controlPanLeft.style.top =  '-50px';
  controlPanLeft.style.left =  '0px';
  controlPanLeft.addEventListener('click', function() {
    map.panBy(-320, 0);
  });
  controlUI.appendChild(controlPanLeft);
  
  var controlPanRight = document.createElement('div');
  controlPanRight.title = 'Pan right';
  controlPanRight.style.backgroundColor = 'transparent';
  controlPanRight.style.position = 'relative';
  controlPanRight.style.width = '36px';
  controlPanRight.style.height = '36px';
  controlPanRight.style.cursor = 'pointer';
  controlPanRight.style.top =  '-86px';
  controlPanRight.style.left =  '44px';
  controlPanRight.addEventListener('click', function() {
    map.panBy(320, 0);
  });
  controlUI.appendChild(controlPanRight);
  
}

});

var x = document.getElementById("coordinates");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        //x.innerHTML = "Geolocation is not supported by this browser.";
        console.log('error');
    }
}
function showPosition(position) {
    partyLatitude = position.coords.latitude;
    partyLongitude = position.coords.longitude; 
    console.log(position.coords);
    console.log("got here");
}

getLocation();