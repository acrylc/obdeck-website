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
		},

		initialize: function() {
			app.vent.on('displayIssue', this.navigateIssue, this);

		},

		navigateHome: function() {
			console.log('home');
			app.router.navigate('/');
		},

		navigateIssue: function(issue){
			console.log('navigating to '+issue);

			// update the url
			app.router.navigate('/'+issue);

			// clear DOM
			$('#content').empty();
			var view = new app.Views.IssueView({'issue':issue});
		}

	});

});