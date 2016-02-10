//Memory Test

$(document).ready(function() {
  $("#generate").click(function() {
  	timer();
    var min = parseInt($("#min").val());
    var max = parseInt($("#max").val());
    var col = $("#col").val();
    var row = $("#row").val();
    var repeat = $("#repeat")[0].checked;
    var valid = (min < max) || col < 1 || row < 1;
    // if repeat is not check, check is theres enough numbers to fill the row/cols
    if(!repeat){    
    	valid = valid && ((row*col) <= (max - min))
    }
    if(valid){
    	$("#nb").empty();
      $("#dashboard").hide();
      generate(min, max, col, row, repeat);
      // add button
      var $input = $('<input id="test" type="button" value="Answer" onclick="showTestInputs()"  />');
      $input.appendTo($("#wrapper"));
    }else{
    	$("#wrapper").prepend('<div class="alert alert-danger alert-dismissable">'
      + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'
      + 'Invalid Inputs.'
      + '</div>')
    }
    
  });
});

// functions

// pad -> turn 2 into 02
function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
};

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};
// generate possible value for non-repeat array
function generatePool(min, max) {
  var arr = [];
  for (var i = min; i <= max; i++) {
    arr[i] = i;
  }
  return arr
}

function generate(min, max, col, row, repeat) {
  var nbTotal = col * row;
  var arr = [];

  if (repeat) {
    arr = repeatArray(min, max, nbTotal);
  } else {
    arr = nonRepeatArray(min, max, nbTotal);
  }
  // store in browser
  $("#myData").val(arr.join());
  for (var r = 0; r < row; r++) {
    for (var c = 0; c < col; c++) {
      var nb = arr[0];
      $("#nb").append(pad(nb, max.toString().length) + " ");
      arr.splice(0, 1);
    }
    $("#nb").append("<br>");
  }
}

function repeatArray(min, max, nbTotal) {
  var arr = [];
  for (var i = 0; i < nbTotal; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return arr;
}

function nonRepeatArray(min, max, nbTotal) {
  var arr = generatePool(min, max);
  arr = shuffleArray(arr);
  // remove the difference
  arr.splice(0, arr.length - nbTotal);
  return arr;
}

function resetGame() {
  $("#dashboard").show();
  $("#nb").empty();
  $("#test-inputs").empty();
  $("#result").empty();
  $("#reset").remove();
  resetTimer();
}

function showTestInputs() {
	stopTimer();
  var col = $("#col").val();
  var row = $("#row").val();
  var o = "<table id='table-input' class='table table-striped table-bordered'>";
  for (var r = 0; r < row; r++) {
    o += "<tr>";
    for (var c = 0; c < col; c++) {
      o += "<td><input type='text' /> </td>";
    }
    o += "</tr>";
  }
  o += "</table>";
  $("#test-inputs").html(o);
  $("#nb").empty();
  $("#test").remove();
  var $input = $('<input id="correct" type="button" value="Correct" onclick="autoCorrect()"  />');
  $input.appendTo($("#myButtons"));
  var max = parseInt($("#max").val());
  if(max.toString().length == 1){
  	$("#test-inputs input[type='text']").css("width", "14px");
  }else{
  	$("#test-inputs input[type='text']").css("width", "28px");
  }
}

function autoCorrect() {
  var arr = [];
  // retrive hidden values
  var answer = $("#myData").val().split(",").map(Number);
  var goodAnswer = 0;
  var i = 0;
  var max = $("#max").val();
  var col = $("#col").val();
  var row = $("#row").val();
    
  $('#table-input td').each(function() {
    var v = parseInt($(this).children("input").val());
    arr.push(v);
    if (answer[i] != arr[i]) {    	
      $(this).css("background-color", "#ff8080");
      $(this).append(pad(answer[i], max.toString().length));
    }else{
    	goodAnswer++;
    }
    i++;
  });
  $("#correct").remove();
  
  var percentGood = goodAnswer/arr.length * 100;
  percentGood = Math.round(percentGood * 100) / 100;
  var secPerNb = (hours * 60 *60 + minutes * 60 + seconds) / (row * col);
  secPerNb = Math.round(secPerNb * 100) / 100;
  var result = "<br><table class='table table-striped table-bordered'>"
  + "<tr><th>Result</th><th>Accuracy</th><th>Time</th><th>Time/nb</th></tr>"
  + "<tr><td>" + goodAnswer + "/" + arr.length + "</td>"
  + "<td>" + percentGood + "%</td>"
  + "<td>" + hours + ":" + minutes + ":" + seconds + "</td>"
  + "<td>" + secPerNb + "s</td>"
  + "</tr></table>"
  $("#result").html(result);
  
  var $input = $('<input id="reset" type="button" value="Reset" onclick="resetGame()"  />');
  $input.appendTo($("#myButtons"));
}

// ****** Timer stuff ********

var h1 = document.getElementsByTagName('h1')[0],
    seconds = 0, minutes = 0, hours = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    /*h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);*/

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}
function stopTimer(){
	clearTimeout(t);
}
function resetTimer(){
	seconds = 0; minutes = 0; hours = 0;
}