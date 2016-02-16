"use strict";

var min = 0;
var max = 0;
var col = 0;
var row = 0;
var arrData = [];

$(document).ready(function() {

    // Generate click
    $("#generate").click(function() {
        timer();
        min = parseInt($("#min").val());
        max = parseInt($("#max").val());
        col = $("#col").val();
        row = $("#row").val();
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
            var $input = $('<input id="answer" type="button" value="Answer" onclick="showAnswerInputs()"  />');
            $input.appendTo($("#wrapper"));
            $("#answer")[0].focus();
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
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
// generate possible value for non-repeat array
function generatePool(min, max) {
    var arr = [];
    for (var i = min; i <= max; i++) {
        arr.push(i);
    }
    return arr
}

function generate(min, max, col, row, repeat) {
    var nbTotal = col * row;
    var arr = [];
    var clone;

    if (repeat) {
        arrData = repeatArray(min, max, nbTotal);
    } else {
        arrData = nonRepeatArray(min, max, nbTotal);
    }
    clone = arrData.slice(0);
    arr = clone;
    // write numbers to browser
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
    $("#answer-inputs").empty();
    $("#result").empty();
    $("#reset").remove();
    resetTimer();
    $("#generate").focus();
}

function showAnswerInputs() {
    stopTimer();
    var o = "<table id='table-input' class='table table-striped table-bordered'>";

    for (var r = 0; r < row; r++) {
        o += "<tr>";
        for (var c = 0; c < col; c++) {
            o += "<td><input type='number' /> </td>";
        }
        o += "</tr>";
    }
    o += "</table>";
    $("#answer-inputs").html(o);
    $("#nb").empty();
    $("#answer").remove();
    var $input = $('<input id="correct" type="button" value="Correct" onclick="autoCorrect()"  />');
    $input.appendTo($("#myButtons"));

    if(max.toString().length == 1){
        $("#answer-inputs input[type='number']").css("width", "14px");
    }else{
        $("#answer-inputs input[type='number']").css("width", "28px");
    }
    // focus on next input when full
    $("#table-input td input").keyup(function(){
        if(this.value.toString().length >= max.toString().length){
            var nextTDInput = $(this).parent().next('td').children("input");
            if(nextTDInput[0] != undefined){
                nextTDInput.focus();
            }else{
                var nextTR = $(this).parents("tr").next("tr");
                var nextInupt = nextTR.find("input:first")[0];
                if(nextInupt != undefined){
                    nextInupt.focus();
                }else{
                    $("#correct").focus();
                }
            }
        }
    });
    $('#table-input td input')[0].focus();
}

function autoCorrect() {
    var arr = [];
    var goodAnswer = 0;
    var i = 0;

    $('#table-input td').each(function() {
        var v = parseInt($(this).children("input").val());
        arr.push(v);
        if (arrData[i] != arr[i]) {
            $(this).css("background-color", "#ff8080");
            $(this).append(pad(arrData[i], max.toString().length));
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
        + "</tr></table>";
    $("#result").html(result);

    var $input = $('<input id="reset" type="button" value="Reset" onclick="resetGame()"  />');
    $input.appendTo($("#myButtons"));

    $("#reset").focus();
}

// ****** Timer stuff ********

//var h1 = document.getElementsByTagName('h1')[0];
var seconds = 0, minutes = 0, hours = 0, t;

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

    //h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    //timer();
}
function timer() {
    t = setInterval(add, 1000);
}
function stopTimer(){
    clearTimeout(t);
}
function resetTimer(){
    seconds = 0; minutes = 0; hours = 0;
}