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
			app.vent.on('displayIssue', this.navigateIssue, this);
			app.vent.on('displayIssuesPage', this.navigateIssues, this);

		},

		navigateHome: function() {
			console.log('home');
			app.router.navigate('/');
			var view = new app.Views.HomeView({});
		},

		navigateIssue: function(issue){
			console.log('navigating to '+issue);

			// update the url
			app.router.navigate('/issues/'+issue);

			// clear DOM
			$('#content').empty();
			var view = new app.Views.IssueView({'issue':issue});
		},

		navigateIssues: function(){
				console.log('issues');
			app.router.navigate('/issues');
			var view = new app.Views.IssuePage({});
		},

		navigateAbout: function(){
			app.router.navigate('/about');
			// var view = new app.Views.IssuePage({});
		}, 

		navigateParticipate: function(){
			app.router.navigate('/participate');
		}


	});

});