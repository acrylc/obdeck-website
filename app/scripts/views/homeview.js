var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {}
};


// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

	// Dynamic content view
	// ---------------
	// Pass an issue hashtag, will get from Firebase corresponding data
	// and visualize dynamically in map or list view depending on set controls
	// sample usage :
	// var view = new app.Views.StoryVisualization({issue : "bribery"});
	app.Views.HomeView = Backbone.View.extend({

		el: "#content",

		template: _.template( $('#home-template').html() ),

		// Listen to navbar, update content accordingly
		events: {
		},

		initialize: function() {

			this.render();
		},

		events: {
			'click .issue-link' : 'goToIssue'
		}, 

		goToIssue: function(e){
		
			var issue = e.toElement.id;
			console.log(e.toElement.id);
			app.vent.trigger('displayIssue', issue);	
		},

		render: function(){
			$(this.el).empty();
			$(this.el).html((this.template({})));
			return this;
		}

	});

});