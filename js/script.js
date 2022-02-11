// Globala variabler
var subjectMenuElem, courseMenuElem;	// Referenser till select-elementen för menyerna
var subjectInfoElem, courseListElem;	// Referenser till div-elementen där inläst data ska skrivas

// Initiering av globala variabler och händelsehanterare
function init() {
	subjectMenuElem = document.getElementById("subjectMenu");
	courseMenuElem = document.getElementById("courseMenu");
	subjectInfoElem = document.getElementById("subjectInfo");
	courseListElem = document.getElementById("courseList");
	subjectMenuElem.addEventListener("change",selectSubject);
	courseMenuElem.addEventListener("change",selectCourses);
} // End init
window.addEventListener("load",init); // init aktiveras då sidan är inladdad

// ----- Meny 1 -----

// Avläs menyn för val av ämne
function selectSubject() {
	let subject = this.selectedIndex; // Ämne i menyns option-element
	requestData(subject);
	this.selectedIndex = 0; // Återställ menyn
} // End selectSubject

// Söker efter information från PHP filen 
function requestData(subject) {
	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	request.open("GET","getSubInfo.php?file=https://medieteknik.lnu.se/1me323/subjects.xml&id=" + subject,true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4) // readyState 4 --> kommunikationen är klar
			if (request.status == 200) getData(request.responseXML); // status 200 (OK) --> filen fanns
											// request.responseXML då vi läser in XML-kod
			else subjectInfoElem.innerHTML = "Den begärda resursen finns inte.";
	};
} // End requestDepartmentinfo

// Hämtar informationen och lägger in det på sidan
function getData(XMLcode) {
	let HTMLcode = ""; // Textsträng med ny HTML-kod som skapas
		let nameElem = XMLcode.getElementsByTagName("name")[0];
		let infoElem = XMLcode.getElementsByTagName("info")[0];
		HTMLcode += "<h3>" + nameElem.firstChild.data  + "</h3>";
		HTMLcode += infoElem.firstChild.data + "</p>";
	subjectInfoElem.innerHTML = HTMLcode;	// Skriver ut texten i rätt plats
} // End getData

// ----- Meny 2 -----

// Avläs menyn för val av ämne för kurser
function selectCourses() {
	let course = this.selectedIndex; // Ämne i menyns option-element
	requestInfo(course);
	this.selectedIndex = 0;
} // End selectCourses

// Söker efter information från xml filerna
function requestInfo(course) {
	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	request.open("GET","xml/courselist" + course + ".xml",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4) // readyState 4 --> kommunikationen är klar
			if (request.status == 200) getInfo(request.responseXML); // status 200 (OK) --> filen fanns
											// request.responseXML då vi läser in XML-kod
			else subjectInfoElem.innerHTML = "Den begärda resursen finns inte.";
	};
} // End requestDepartmentinfo

// Hämtar informationen och lägger in det på sidan i andra menyn
function getInfo(XMLcode) {
	let subElem = XMLcode.getElementsByTagName("courselist");
	let subjectElems = XMLcode.getElementsByTagName("course"); // Lista (array) med alla course-element
	let HTMLcode = ""; // Textsträng med ny HTML-kod som skapas
	for (let i = 0; i < subElem.length; i++) {
	let headerElem = subElem[i].getElementsByTagName("subject")[0];
	HTMLcode += "<h3>" + headerElem.firstChild.data + "</h3>";
	}
	for (let i = 0; i < subjectElems.length; i++) {
		let codeElem = subjectElems[i].getElementsByTagName("code")[0];
		let titleElem = subjectElems[i].getElementsByTagName("title")[0];
		let creditsElem = subjectElems[i].getElementsByTagName("credits")[0];
		HTMLcode += codeElem.firstChild.data + ", " + titleElem.firstChild.data + ", " + creditsElem.firstChild.data + "</p>";
	}
	courseListElem.innerHTML = HTMLcode;
} // End getData

