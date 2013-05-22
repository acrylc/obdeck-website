var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {},
};
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){
	
	app.Views.IssuePage = Backbone.View.extend({

		el: "#content",

		template: _.template( $('#issues-template').html() ),

		// Listen to navbar, update content accordingly
		events: {
			"click .issue":"renderIssue",
			"keypress #search" : "searchIssue"
		},

		initialize: function() {
			this.render();
		},

		render: function(){
			$(this.el).empty();
			$(this.el).html(this.template());
			return this;
		},

		searchIssue:function(e){
			if (e.keyCode == 13){
				console.log('Entered '+$('#search').val());
				id = $('#search').val();
				if (id!=undefined){
					app.router.navigate('/'+id);
					id = id.toLowerCase();
					app.vent.trigger('displayIssue', id);
				}
			}
		}, 

		renderIssue: function(t){
			id = t.toElement.id;
				app.router.navigate('/'+id);
				id = id.toLowerCase();
				app.vent.trigger('displayIssue', id);

		}

	});	


});