

$(function(){

		// temporary json object containing all the issue parameters to 
			// dynamically create an issue page
			//  app.issue = {
			// 	overview : " While they realize they will not be able to reverse the 17-month extension of parliament’s mandate that became effective today, protestors are determined to stay at the southern entrance of Nejmeh Square to make their voices heard. Exactly how long they’ll remain, however, is still unclear. As the call to prayer reverberated throughout downtown and a steady stream of traffic circumnavigated a small cluster of tents and people positioned in the middle of the street, Naji Raji sat and talked with fellow demonstrators. Raji, a founder of Save Beirut Heritage, said he came down to protest the inaction of successive legislatures on an issue dear to his heart. “My cause is Save Beirut Heritage,” he said. “There’s been a law [to protect old buildings] put in parliament’s drawers for [six] years now.” Asked what he hopes to accomplish given that parliament’s term extension has now gone into effect, Raji said he wanted “to make some noise.” Lebanon’s last parliamentary elections took place in 2009, and the current legislature’s term was set to expire on June 20. For most of the past year, the country’s political parties have been bickering over a new electoral law to replace the one that governed the last polls. During that time, politicians from across the spectrum confided to NOW that they believed the elections would be postponed.",
			// 	timeline_doc : "https://docs.google.com/spreadsheet/pub?key=0AvsGYBn6aGTpdFlVWFB6S2JmczBON3gtM1J2SHhpVlE&output=html",
			// 	heroimage : "../images/hala.jpg",
			// 	keyplayers: [
			// 		{	name : "Take back parliament", 
			// 			description : "A short description describing this groups relation to the issue, and why to contact. ", 
			// 			logo : "images/tbp.jpg",
			// 			contact : {fb : "fb.com/vote2013"} 
			// 		},
			// 		{	name : "من أجل الجمهورية", 
			// 			description : "A short description describing this groups relation to the issue, and why to contact. ", 
			// 			logo : "images/mag.jpg",
			// 			contact :  {fb : "fb.com/vote2013"} 
			// 		},
			// 		{	name : "Lebanese parliament", 
			// 			description : "A short description describing this groups relation to the issue, and why to contact. ", 
			// 			logo : "images/lp.svg",
			// 			contact : {} 
			// 		}
			// 	]
			// };

			//  app.issue = {
			// 	overview : " Yesterday night, Nadine Moawad, spokesperson for Nasawiya, posted on Facebook “Urgent. The shabbee7a of Nadim Gemayel just carried machine guns in our faces in Nasawiya. We are now locked in.” Later we found out that apparently the bodyguards entered the Nasawiya HQ in Mar Mikhael and demanded that the feminists stop taking pictures. Taking pictures? Yes, Nasawiya was having a farewell party and pictures tend to be part of a party. The ‘problem’, according to the thugs, is that our dear Nadim Gemayel was having a dinner nearby and apparently has a reputation of being paranoid. When the feminists refused (and rightly so), the thugs pointed machine guns at an activist and threatened to shoot saying they had “permission to do so”. The feminists got scared and locked themselves in, waiting for the police to intervene, which they eventually did. Part of the confrontation was filmed and uploaded on Facebook.",
			// 	timeline_doc : "https://docs.google.com/spreadsheet/pub?key=0AvsGYBn6aGTpdDc5YlVFeVdzek02VjlsQUdXeUFra1E&output=html",
			// 	heroimage : "../images/pat.jpg",
			// 	keyplayers: [
			// 		{	name : "Nadim Gemayel", 
			// 			description : "A short description describing this groups relation to the issue, and why to contact. ", 
			// 			logo : "images/nadimgemayel.jpg",
			// 			contact :  {fb : "fb.com/vote2013"} 
			// 		},
			// 		{	name : "Take back parliament", 
			// 			description : "A short description describing this groups relation to the issue, and why to contact. ", 
			// 			logo : "images/tbp.jpg",
			// 			contact : {fb : "fb.com/vote2013"} 
			// 		}
			// 	]
			// };
			app.issue = {};
			
	// Global event
	app.vent = _.extend({}, Backbone.Events);


	var a = new app.Views.AppView();

	// Initalize router and start listening to routes
	app.router = new app.Routers.Router();
	Backbone.history.start();

	a.navigateHome();


});



