
var startTestTime = null;
var startQuestionTime = null;
var startCountDownTime = null;

var qAnswer = null;

var numSetQuestions = 20;
var numRandomQuestions = 5;

var upperBoundAS = 10;
var upperBoundDM = 10;

var intId = null;
var countDownId= null;
var currentQuestionIndex = 0;

var qType = null;


var testTime = null;
var questionCount = 0;

var results = new Array();
var questions = new Array();

var countDownStartTime = 4;


$(document).ready(function () {
	results.push(new resultOperation("Total"));
	results.push(new resultOperation("Addition"));
	results.push(new resultOperation("Subtraction"));
	results.push(new resultOperation("Multiply"));
	results.push(new resultOperation("Division"));

	
	
	generateQuestions();
	
	
	
	$("#resultBox").hide();
	$("#questionContainer").hide();
	$("#instructionContainer").hide();
	
	$("#startBox").click(function(){
		beginCountDown();
	});

	$("body").bind("keyup", function(event){
		if(event.keyCode == 13 || event.keyCode == 32){
			beginCountDown();
		}
	});
});

function beginCountDown(){
	$('#countDown').text(countDownStartTime);
	$("#instructionContainer").show();
	$("#startContainer").hide(); 
	startCountDownTime = new Date;
	
	countDownId = self.setInterval(function() { 
		$('#countDown').text((countDownStartTime - (new Date - startCountDownTime) / 1000).toFixed(0));
		if((new Date - startCountDownTime) > countDownStartTime*1000 - 800)
			beginTest();
	}, 10); 
	
}

function beginTest(){
	$("#instructionContainer").hide();
	clearInterval(countDownId);
	$("body").unbind();
	$("#answer").bind("keyup", function(event){
		if(event.keyCode == 13 || event.keyCode == 32){
			checkAnswer($(this).val());
			$(this).val(""); //Clear the old answer out
			showQuestion();
		}
	});
	
	$("#startContainer").hide();
	$("#questionContainer").show();
	
	startTestTime = new Date;
	intId = self.setInterval(function() { $('#timer').text("Time: " + (new Date - startTestTime) / 1000 ); 	}, 10); 
	$("#answer").focus();
	showQuestion();
}

function finishTest(){
	$("#answer").attr('disabled', 'disabled');
	clearInterval(intId);
	testTime = (new Date - startTestTime) / 1000;
	generateResults();
	$("#center").fadeOut(800, function(){
		var resultString = "Total Time: " + testTime + " seconds<br>";
		resultString += "<table id='result'><tr class='red'><td>OPERATION</td><td>CORRECT</td><td>AVG TIME</td><td>MAX TIME</td><td>MIN TIME</td></tr>";

		for (i=0;i<=4;i++){
			resultString += "<tr><td>" +results[i].operation + "</td><td>" +
										results[i].numCorrect + "/" + results[i].count
										+ "</td><td>" +
										results[i].avg()+ "</td><td>" +
										results[i].max + "</td><td>" +
										results[i].min + "</td><td>" +
										"</tr>";
		}
		resultString += "</table>";		
		
		var shareString = "I scored " + results[0].numCorrect + "/" + results[0].count + " in " + testTime + "s. Try and beat me! http://goo.gl/LhVwk";
		
		resultString += '<div id="shareBox" style="float:left;"> <span class="red">Share:</span> <input id="shareResult" type="text" size=45 value="'+ shareString + '"></input></div>';
		
		
		$("#resultTable").html(resultString);
		$("#resultBox").show();
		
		//Auto select all the contents of the input box on click
		$("#shareResult").hover(function() {
			$(this).select();
		});
	});
}

/////////////////////////

function generateQuestions(){
	//Generates even amounts of questions
	for(i=1;i<=numSetQuestions/4;i++){
		questions.push(makeAddition());
		questions.push(makeSubtraction());
		questions.push(makeMultiplication());
		questions.push(makeDivision());
	}
	
	//Generates s number of random questions
	for(i=1;i<=numRandomQuestions;i++){
		qType = Math.floor(Math.random()*4);
		if(qType == 0)
			questions.push(makeAddition());
		else if(qType == 1)
			questions.push(makeSubtraction());
		else if(qType == 2)
			questions.push(makeMultiplication());
		else
			questions.push(makeDivision());
	}
}


//Pulls in the array of questions with their times and figures outs the maxes, mins and averages
function generateResults(){
	for(var i = 0; i<(numSetQuestions + numRandomQuestions); i++){
		results[0].add(questions[i].time,questions[i].correct);
		if(questions[i].operation == "+")
			results[1].add(questions[i].time,questions[i].correct);
		else if(questions[i].operation == "-")
			results[2].add(questions[i].time,questions[i].correct);
		else if(questions[i].operation == "x")
			results[3].add(questions[i].time,questions[i].correct);
		else
			results[4].add(questions[i].time,questions[i].correct);
	}
}

//Picks a question at random and displays it for the user to answer
function showQuestion(){
	if(questionCount == numSetQuestions + numRandomQuestions)
		finishTest();
	else{
		while(1){
			currentQuestionIndex = Math.floor(Math.random()*(numSetQuestions + numRandomQuestions));
			if(questions[currentQuestionIndex].time == 0){
				var temp = (numSetQuestions + numRandomQuestions) - questionCount;
				$("#qNum").text("QUESTION #" + temp);
				$("#question").text(questions[currentQuestionIndex].part1 + " " +
									questions[currentQuestionIndex].operation + " " +
									questions[currentQuestionIndex].part2 + " = ");

				questionCount = questionCount + 1
				startQuestionTime = new Date; //sets a starting time for the question
				break;
			}
		}
	}
}


function checkAnswer(val){
	var questionLength = (new Date - startQuestionTime) /1000;
	questions[currentQuestionIndex].time = questionLength;
	if(val == questions[currentQuestionIndex].answer)
		questions[currentQuestionIndex].correct = true;
}

///////////////////////////////////////

function makeAddition(){
	var tempQ = new question();
	//tempQ.operationName = "Addition";
	tempQ.operation = "+";
	tempQ.part1 = Math.floor(Math.random()*(upperBoundAS + 1));
	tempQ.part2 = Math.floor(Math.random()*(upperBoundAS + 1));
	tempQ.answer = tempQ.part1 + tempQ.part2;
	return tempQ;
}

function makeSubtraction(){
	var tempQ = new question();
	//tempQ.operationName = "Subtraction";
	tempQ.operation = "-";
	tempQ.part2 = Math.floor(Math.random()*(upperBoundAS + 1));
	tempQ.answer = Math.floor(Math.random()*(upperBoundAS + 1));
	tempQ.part1 = tempQ.answer + tempQ.part2;
	return tempQ;
}

function makeDivision(){
	var tempQ = new question();
	//tempQ.operationName = "Division";
	tempQ.operation = "/";
	tempQ.part2 = Math.floor(Math.random()*(upperBoundDM + 1)) + 1;
	tempQ.answer = Math.floor(Math.random()*(upperBoundDM + 1));
	tempQ.part1 = tempQ.part2 * tempQ.answer;
	return tempQ;
}

function makeMultiplication(){
	var tempQ = new question();
	//tempQ.operationName = "Division";
	tempQ.operation = "x";
	tempQ.part1 = Math.floor(Math.random()*(upperBoundDM + 1));
	tempQ.part2 = Math.floor(Math.random()*(upperBoundDM + 1));
	tempQ.answer = tempQ.part1 * tempQ.part2;
	return tempQ;
}


///////////////////////////////////////////

//An object to store individual informatioon about each question
function question(){
	//this.operationName = "";
	this.operation = "";
	this.part1 = 0;
	this.part2 = 0;
	this.answer = 0;
	this.time = 0;
	this.correct = false;
}

//An object to store the resutls of a given operation
function resultOperation(op){
	this.operation = op;
	this.count = 0;
	this.sum = 0;
	this.min = 10000;
	this.max = 0;
	this.numCorrect = 0;
	
	this.avg = function(){
		return (this.sum/this.count).toFixed(3);
	}
	
	this.add = function(time, correct){
		this.count = this.count + 1;
		this.sum = this.sum + time;
		if(time > this.max)
			this.max = time;
		if(time < this.min)
			this.min = time;
		if(correct)
			this.numCorrect = this.numCorrect + 1;
	}
}

//Results Object
function results(op){
	this.operation = op;
	this.right = new Array(); //Not used, but could be accessed for more analytics
	this.wrong = new Array();  //Not used, but could be accessed for more analytics
	this.rightCount = 0;
	this.wrongCount = 0;

	this.sum = 0;
	this.max = 0;
	this.min = 1000;
	
	this.avg = function(){
			var temp = this.sum / (this.rightCount + this.wrongCount);
			return temp.toFixed(3);
		}
	
	this.add = function(num){
			this.sum = this.sum + num;
			if(num > this.max)
				this.max = num
			if(num < this.min)
				this.min = num
		};
		
	this.addRight = function(num){
			this.right.push(num);
			this.rightCount =this.rightCount +1;
			this.add(num);
		};
		
	this.addWrong = function(num){
			this.wrong.push(num);
			this.add(num);
			this.wrongCount =this.wrongCount +1;
		};
}