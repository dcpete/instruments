// college_capacity is an unordered list of instruments and their max number of student allowed
var college_capacity = {
  "Flute": 16,
  "Clarinet": 21,
  "Saxophone": 10,
  "Horn": 10,
  "Trumpet": 16,
  "Trombone": 16,
  "Baritone": 10,
  "Percussion": 13
}

// student_prefs is an unordered list of students and their preferences
// each student's preferences are an ordered list (first is most preferred)
var student_prefs = {}
var student_prefs_in = [
  ["Student1","Baritone","Saxophone","Trombone"],
  ["Student2","Baritone","Trombone","Horn"],
  ["Student3","Baritone","Trombone","Flute"],
  ["Student4","Baritone","Saxophone","Horn"],
  ["Student5","Baritone","Saxophone","Trumpet"],
  ["Student6","Baritone","Horn","Saxophone"],
  ["Student7","Baritone","Horn","Saxophone"],
  ["Student8","Baritone","Clarinet","Horn"],
  ["Student9","Baritone","Percussion","Trumpet"],
  ["Student10","Baritone","Horn","Trombone"],
  ["Student11","Baritone","Trumpet","Trombone"],
  ["Student12","Baritone","Trombone","Horn"],
  ["Student13","Baritone","Horn","Trumpet"],
  ["Student14","Baritone","Trumpet","Horn"],
  ["Student15","Clarinet","Saxophone","Trombone"],
  ["Student16","Clarinet","Horn","Saxophone"],
  ["Student17","Clarinet","Trumpet","Horn"],
  ["Student18","Clarinet","Flute","Trumpet"],
  ["Student19","Clarinet","Saxophone","Flute"],
  ["Student20","Clarinet","Saxophone","Trumpet"],
  ["Student21","Clarinet","Flute","Baritone"],
  ["Student22","Clarinet","Trumpet","Trombone"],
  ["Student23","Clarinet","Trombone","Baritone"],
  ["Student24","Flute","Clarinet","Trumpet"],
  ["Student25","Flute","Clarinet","Baritone"],
  ["Student26","Flute","Clarinet","Trumpet"],
  ["Student27","Flute","Clarinet","Saxophone"],
  ["Student28","Flute","Horn","Saxophone"],
  ["Student29","Flute","Trumpet","Percussion"],
  ["Student30","Horn","Flute","Clarinet"],
  ["Student31","Horn","Trumpet","Flute"],
  ["Student32","Horn","Trumpet","Saxophone"],
  ["Student33","Horn","Trombone","Clarinet"],
  ["Student34","Horn","Trumpet","Clarinet"],
  ["Student35","Horn","n/a","n/a"],
  ["Student36","Horn","Trumpet","Trombone"],
  ["Student37","Horn","Trumpet","Saxophone"],
  ["Student38","Horn","Trumpet","Trombone"],
  ["Student39","Horn","Trumpet","Trombone"],
  ["Student40","Horn","Trombone","Baritone"],
  ["Student41","Horn","Trumpet","Saxophone"],
  ["Student42","Horn","Clarinet","Trumpet"],
  ["Student43","Percussion","Trombone","Baritone"],
  ["Student44","Percussion","Trombone","Saxophone"],
  ["Student45","Percussion","Saxophone","Horn"],
  ["Student46","Percussion","Clarinet","Flute"],
  ["Student47","Percussion","Flute","Clarinet"],
  ["Student48","Percussion","Trumpet","Saxophone"],
  ["Student49","Percussion","Trumpet","Trombone"],
  ["Student50","Percussion","Trumpet","Trombone"],
  ["Student51","Saxophone","Clarinet","Baritone"],
  ["Student52","Saxophone","Clarinet","Trumpet"],
  ["Student53","Saxophone","Baritone","Clarinet"],
  ["Student54","Saxophone","Baritone","Clarinet"],
  ["Student55","Saxophone","Clarinet","Baritone"],
  ["Student56","Saxophone","Flute","Trumpet"],
  ["Student57","Saxophone","Flute","Baritone"],
  ["Student58","Saxophone","Flute","Clarinet"],
  ["Student59","Saxophone","Flute","Trombone"],
  ["Student60","Saxophone","Percussion","Clarinet"],
  ["Student61","Saxophone","Percussion","Horn"],
  ["Student62","Saxophone","Horn","Baritone"],
  ["Student63","Saxophone","Trumpet","Horn"],
  ["Student64","Saxophone","Percussion","Clarinet"],
  ["Student65","Saxophone","Baritone","Trombone"],
  ["Student66","Saxophone","Clarinet","Trumpet"],
  ["Student67","Saxophone","Baritone","Trombone"],
  ["Student68","Saxophone","Baritone","Horn"],
  ["Student69","Saxophone","Clarinet","Horn"],
  ["Student70","Saxophone","Trumpet","Trombone"],
  ["Student71","Saxophone","Clarinet","Trombone"],
  ["Student72","Saxophone","Clarinet","Baritone"],
  ["Student73","Saxophone","Percussion","Trombone"],
  ["Student74","Saxophone","Trombone","Baritone"],
  ["Student75","Trombone","Percussion","Baritone"],
  ["Student76","Trombone","Baritone","Horn"],
  ["Student77","Trombone","Baritone","Saxophone"],
  ["Student78","Trombone","Horn","Baritone"],
  ["Student79","Trombone","Saxophone","Baritone"],
  ["Student80","Trombone","Clarinet","Baritone"],
  ["Student81","Trombone","Baritone","Clarinet"],
  ["Student82","Trombone","Clarinet","Trumpet"],
  ["Student83","Trombone","Baritone","Trumpet"],
  ["Student84","Trombone","Horn","Saxophone"],
  ["Student85","Trombone","Baritone","Saxophone"],
  ["Student86","Trumpet","Baritone","Trombone"],
  ["Student87","Trumpet","Trombone","Clarinet"],
  ["Student88","Trumpet","Clarinet","Trombone"],
  ["Student89","Trumpet","Flute","Baritone"],
  ["Student90","Trumpet","Flute","Trombone"],
  ["Student91","Trumpet","Trombone","Flute"],
  ["Student92","Trumpet","Trombone","Baritone"],
  ["Student93","Trumpet","Trombone","Saxophone"],
  ["Student94","Trumpet","Trombone","Horn"],
  ["Student95","Trumpet","Saxophone","Clarinet"],
  ["Student96","Trumpet","Saxophone","Flute"],
  ["Student97","Trumpet","Horn",""],
  ["Student98","Trumpet","Saxophone","Horn"],
  ["Student99","Trumpet","Clarinet","Saxophone"],
  ["Student100","Trumpet","Saxophone","Baritone"],
  ["Student101","Trumpet","Horn","Flute"],
  ["Student102","Trumpet","Trombone","Horn"],
  ["Student103","Trumpet","Clarinet","Baritone"],
  ["Student104","Trumpet","Saxophone","Horn"],
  ["Student105","Trumpet","Trombone","Baritone"],
  ["Student106","Trumpet","Horn","Trombone"],
  ["Student107","Trumpet","Flute","Trombone"],
  ["Student108","Trumpet","Saxophone","Horn"],
  ["Student109","Trumpet","Saxophone","Clarinet"],
  ["Student110","Trumpet","Saxophone","Flute"],
  ["Student111","Trumpet","Clarinet","Saxophone"],
  ["Student112","Trumpet","Clarinet","Flute"]
]
student_prefs_in.forEach(row => {
	student_prefs[row[0]] = row.slice(1);
})


// ---------------------------------
// STOP
// no need to change anything else
// --------------------------------- 

// get list of instruments from the college_capacity keys
var instruments = Object.keys(college_capacity);
// figure out the max number of preferences by finding the highest number of preferences that any student listed
var maxChoices = 0;
Object.values(student_prefs).forEach(prefArray => {
	if (prefArray.length > maxChoices) {
  	maxChoices = prefArray.length
  }
})

// shuffle function from https://github.com/Daplie/knuth-shuffle/blob/master/index.js
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var logArray = [];
var numberOfTrials = 100;

for (var c = 0; c < numberOfTrials; c++) {
  // college_prefs is an unordered list of each instrument and their list of desired students
  // each list of students is an ordered list that ranks students (first is most desired student)
  // note: students that do not appear on an instrument's list will never be assigned to it
  var college_prefs = {}
  // for each instrument
  college_prefs = instruments.reduce((acc, instrument) => { 
    var studentsWithPref = []; 
    // for each choice (e.g. 1st choice, 2nd choice, etc.)
    for (var i = 0; i < maxChoices; i++) {
      // find the students whose ith choice was this instrument
      var studentsWithThisPrefNumber = Object.entries(student_prefs).filter(pref => pref[1][i] === instrument).map(entry => entry[0]);
      // since the preference list is an absolute ranking and we don't really care about ranking within a choice group, shuffle the list randomly
      studentsWithThisPrefNumber = shuffle(studentsWithThisPrefNumber);
      // add this choice group to the preference list
      studentsWithPref = studentsWithPref.concat(studentsWithThisPrefNumber);
    }
    acc[instrument] = studentsWithPref;
    return acc;
  }, {});

  var preparedInput = { student_prefs, college_prefs, college_capacity };
  var payload = JSON.stringify(preparedInput);
  logArray.push(preparedInput);
}
console.log(logArray);