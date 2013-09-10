var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {},
};

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

	// The Application
	// ---------------
	// Our overall **AppView** is the top-level piece of UI.
	app.Views.AppView = Backbone.View.extend({

		el: $("body"),

		// Listen to navbar, update content accordingly
		events: {
			"click #home":  "navigateHome",
			"click #issue": "navigateIssues", 
			"click #participate" : "navigateParticipate",
			"click #about" : "navigateAbout",

		},

		initialize: function() {
			// app.vent.on('displayIssue', this.navigateIssue, this);
			// app.vent.on('displayIssuesPage', this.navigateIssues, this);

		},

		// Creates an issue page, issue url hardcoded for now
		navigateHome: function() {

			var url =  'https://docs.google.com/spreadsheet/pub?key=0AvsGYBn6aGTpdHJOU2RCVUtDVkFsSkcxcUFHUUZDRGc&output=html';
			app.router.navigate('/');
			var issue;
			var that = this;
			var cms = pepper(url, {
				'Name': 'string',
				'Url': 'string',
				'Content': 'string'
			});
			cms.sync()
			.then(function(data) {
				issue = that.parseIssueData(data);
			})
			.fail(function (error) {
				console.log("Sync Failed: "+ error);
			})
		},

		navigateIssue: function(issue){
			console.log('navigating to '+issue);

			// update the url
			app.router.navigate('/issues/'+issue);

			// clear DOM
			$('#content').empty();
			// var view = new app.Views.IssueView({'issue':issue});
		},

		navigateIssues: function(){
			console.log('issues');
			app.router.navigate('/issues');
			// var view = new app.Views.IssuePage({});
		},

		navigateAbout: function(){
			app.router.navigate('/about');
			// var view = new app.Views.IssuePage({});
		}, 

		navigateParticipate: function(){
			app.router.navigate('/participate');
		}, 

		//NOTE : fix naming
		parseIssueData: function(data){
			var issue = {};
			console.log('FETCHED DATA IS ');
			console.log(data);
			issue.overview = data[1].content;
			issue.timelineDoc = data[4].url;
			issue.heroImage = data[0].url;

			// fetch key players
			issue.keyPlayers = {};
			
			var url =  data[2].url;
			console.log('URL IS ::   ' + url);
			app.router.navigate('/');
			var that = this;
			var cms = pepper(url, {
				'Name': 'string',
				'Description': 'string',
				'Logo': 'string'
							});
			
			cms.sync()
			.then(function(data) {
				issue.keyPlayers = data;
				console.log('Parsed issue data');
				console.log(issue);
				var view = new app.Views.IssueView({'issue' : issue});

			})
			.fail(function (error) {
				console.log("Sync Failed: "+ error);
			})
		}

	});

});