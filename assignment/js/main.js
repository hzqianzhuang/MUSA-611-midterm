/* =====================
Leaflet Configuration
===================== */


// set the crime data and block data
var crimeData = "https://raw.githubusercontent.com/MUSA611-CPLN692-spring2020/datasets/master/geojson/philadelphia-crime-points.geojson";
var censusBlock = "https://raw.githubusercontent.com/MUSA611-CPLN692-spring2020/datasets/master/geojson/philadelphia-census-block-groups-2010.geojson";
var sjoin = "https://raw.githubusercontent.com/hzqianzhuang/MUSA-611-midterm/master/sjoin.geojson";
var list = [];
myMarkers = [];
var myList = [];
var list_unquie = [];
var list_number = [];
var featureGroup;


var getAndParseData = function(Data) {
  return JSON.parse(Data);
};

var makeMarkers = function(data) {
  var markers = [];
  for(var i = 0; i<data.length; i++){
    if(data[i].geometry != null){
      // console.log(data[i].geometry.coordinates);
      var mark = L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]);
      markers.push(mark);
    }
  }
  return markers;
};

var plotMarkers = function(marks) {
  for(var i = 0; i< marks.length; i++){
    marks[i].addTo(map);
  }
  myMarkers = marks;
};

var resetMap = function() {
  for(var i = 0; i< myMarkers.length; i++){
    map.removeLayer(myMarkers[i]);
  }
  map.setView([39.922584, -75.185205], 14)
};

// add Map
var map = L.map('map', {
  center: [39.922584, -75.185205],
  zoom: 14
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


$(document).ready(function() {
  $.ajax(crimeData).done(function(data) {
    var parsed = getAndParseData(data);
    var markers = makeMarkers(parsed.features);
    plotMarkers(markers);
    for(var i = 0; i<parsed.features.length; i++){
      if(list.indexOf(parsed.features[i]) == -1){
        list.push(parsed.features[i].properties.text_general_code);
      }
    }
  });
});


var makeMarkersInList = function(data, code) {
  var markers = [];
  for(var i = 0; i<data.length; i++){
    if(data[i].geometry != null && (data[i].properties.text_general_code == code)){
      // console.log(data[i].geometry.coordinates);
      var mark = L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]);
      markers.push(mark);
    }
  }
  return markers;
};

var makeMarkersTop_5= function(data, code_list) {
  var markers = [];
  for(var i = 0; i<data.length; i++){
    if(data[i].geometry != null && (code_list.indexOf(data[i].properties.text_general_code) != -1)){
      // console.log(data[i].geometry.coordinates);
      var mark = L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]);
      markers.push(mark);
    }
  }
  return markers;
};

var makeMarkersTop_5_center= function(data, code_list) {
  var markers = [];
  for(var j = 0; j<code_list.length; j++){
    var x = 0;
    var y = 0;
    var countX = 0;
    var countY = 0;
    for(var i = 0; i<data.length; i++){
      if(data[i].geometry != null && data[i].properties != null && (data[i].properties.text_general_code === code_list[j]) ){
       x+= data[i].geometry.coordinates[1];
       y+= data[i].geometry.coordinates[0];
       countX++;
       countY++;
      }
    }
    console.log([x/countX, y/countY]);
    var mark = L.marker([x/countX, y/countY]);
    markers.push(mark);
  }
  return markers;
};

var hideAllTopFive = function(){
  $('#explain_1').hide();
  $('#explain_2').hide();
  $('#explain_3').hide();
  $('#explain_4').hide();
  $('#explain_5').hide();
};


$("#selectType").change(function() {
  $.ajax(crimeData).done(function(data) {
    var code = document.getElementById("selectType").value;
    var parsed = getAndParseData(data);
    var markers =  makeMarkersInList(parsed.features, code);
    resetMap();
    plotMarkers(markers);
  });
});


$("#selectType_top5").change(function() {
  hideAllTopFive();
  var divNum = document.getElementById("selectType_top5").value;
  if(divNum == "All Other Offenses"){
    $('#explain_1').show();
    map.setView([39.9213222540323, -75.17864462096772], 18)
    L.popup().setLatLng([39.9213222540323, -75.17864462096772]).setContent('<p>All Other Offenses<br />[39.9213222540323, -75.17864462096772]</p>').openOn(map);
  }else if(divNum == "Thefts"){
    $('#explain_2').show();
    map.setView([39.92012202189781, -75.18169464963505], 18)
    L.popup().setLatLng([39.92012202189781, -75.18169464963505]).setContent('<p>Thefts<br />[39.92012202189781, -75.18169464963505]</p>').openOn(map);

  }else if(divNum == "Vandalism/Criminal Mischief"){
    $('#explain_3').show();
    map.setView([39.92414943362833, -75.179770539823], 18)
    L.popup().setLatLng([39.92414943362833, -75.179770539823]).setContent('<p>Vandalism/Criminal Mischief<br />[39.92414943362833, -75.179770539823]</p>').openOn(map);

  }else if(divNum == "Other Assaults"){
    $('#explain_4').show();
    map.setView([39.92437215596331, -75.17976897247708], 18)
    L.popup().setLatLng([39.92437215596331, -75.17976897247708]).setContent('<p>Other Assaults<br />[39.92437215596331, -75.17976897247708]</p>').openOn(map);

  }else{
    $('#explain_5').show();
    map.setView([39.922750746987965, -75.17775293975906], 18)
    L.popup().setLatLng([39.922750746987965, -75.17775293975906]).setContent('<p>Theft from Vehicle<br />[39.922750746987965, -75.17775293975906]</p>').openOn(map);

  }
});

$("button#Next_1").click(function(){
  $('#intro').hide();
  $('#results_2').show();

  $.ajax(crimeData).done(function(data) {
    var parsed = getAndParseData(data);
    var markers = makeMarkersTop_5(parsed.features,list_unquie.slice(0,5));
    resetMap();
    plotMarkers(markers);
  });
});

$("button#Next_2").click(function(){
  $('#results_2').hide();
  $('#results_3').show();
  $.ajax(crimeData).done(function(data) {
    var parsed = getAndParseData(data);
    var markers = makeMarkersTop_5_center(parsed.features,list_unquie.slice(0,5));
    resetMap();
    plotMarkers(markers);
  });
});

$("button#Next_3").click(function(){
  $('#results_3').hide();
  $('#results_4').show();
  resetMap();
  setTrackMap(sjoin);
});

$("button#Next_4").click(function(){
  $('#results_4').hide();
  $('#results_5').show();
  map.removeLayer(featureGroup);
});

$("button#Previous_2").click(function(){
  $('#results_2').hide();
  $('#intro').show();
  $.ajax(crimeData).done(function(data) {
    var parsed = getAndParseData(data);
    var markers = makeMarkers(parsed.features);
    resetMap();
    plotMarkers(markers);
  });
});

$("button#Previous_3").click(function(){
  $('#results_3').hide();
  $('#results_2').show();
  $.ajax(crimeData).done(function(data) {
    var parsed = getAndParseData(data);
    var markers = makeMarkersTop_5(parsed.features,list_unquie.slice(0,5));
    resetMap();
    plotMarkers(markers);
  });
});

$("button#Previous_4").click(function(){
  map.removeLayer(featureGroup);
  $('#results_4').hide();
  $('#results_3').show();
  $.ajax(crimeData).done(function(data) {
    var parsed = getAndParseData(data);
    var markers = makeMarkersTop_5_center(parsed.features,list_unquie.slice(0,5));
    resetMap();
    plotMarkers(markers);
  });
});

$("button#Previous_5").click(function(){
  $('#results_5').hide();
  $('#results_4').show();
  resetMap();
  setTrackMap(sjoin);
});


$.ajax(crimeData).done(function(data) {
  var parsed = getAndParseData(data);
  for(var i = 0; i<parsed.features.length; i++){
    if(myList.indexOf(parsed.features[i]) == -1){
      myList.push(parsed.features[i].properties.text_general_code);
    }
  }

  for(var i = 0; i<myList.length; i++){
    if(list_unquie.indexOf(myList[i]) == -1){
      list_unquie.push(myList[i]);
    }
  }

  var test_list = new Array(list_unquie.length).fill(0);
  for(var i = 0; i<myList.length; i++){
    test_list[list_unquie.indexOf(myList[i])]++;
  }

  list_number = test_list;

  for(var i = 0; i<list_number.length-1; i++){
    for(var j = 0; j<list_number.length-1-i; j++){
        if(list_number[j]<list_number[j+1]){
          var tmp = list_number[j];
          list_number[j] = list_number[j+1];
          list_number[j+1] = tmp;

          var strTmp = list_unquie[j];
          list_unquie[j] = list_unquie[j+1];
          list_unquie[j+1] = strTmp;
        }
    }
  }

  new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
      labels: list_unquie.slice(0,5),
      datasets: [
        {
          label: "Number of cases",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: list_number.slice(0,5)
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top 5 cases in Philadelphia crime statistics'
      }
    }
  });

});

var setTrackMap = function(url){

  var showResults = function(text,count) {
    $("#results_4 > h2").text(text);
    if(count <= 10){
      $("#results_4 > p").text("This is a neighborhood with a low crime level");
    }
    else if(count <= 20){
      $("#results_4 > p").text("This is a neighborhood with a medium crime level");
    }
    else if(count <= 40){
      $("#results_4 > p").text("This is a neighborhood with a high crime level");
    }
    else{
      $("#results_4 > p").text("This is a neighborhood with a very high crime level");
    }
  };
  

  featureGroup = [];
  var myStyle = function(feature) {
    if(feature.properties.count <= 10){
      return {fillColor: 'green'};
    }
    else if(feature.properties.count <= 20){
      return {fillColor: 'blue'};
    }
    else if(feature.properties.count <= 40){
      return {fillColor: 'yellow'};
    }
    else{
      return {fillColor: 'red'};
    }
  };
  
  var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
      //console.log(layer.feature);
      var count = layer.feature.properties.count;
      console.log(count);
      var str = "The count of this block is ";
      showResults(str+count, count);
    });
  };
  
  var myFilter = function(feature) {
    if(feature.properties.count == null){
      console.log(feature.properties.COLLDAY);
      return false;
    }else{
      return true;
    }
  };
  
  $(document).ready(function() {
    $.ajax(url).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
        style: myStyle,
        filter: myFilter
      }).addTo(map);
  
      featureGroup.eachLayer(eachFeatureFunction);
    });
  });
  
}


