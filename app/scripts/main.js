

$(function(){
	// Global event
	console.log('in main)');
	app.vent = _.extend({}, Backbone.Events);

	var a = new app.Views.AppView();

	// Initalize router and start listening to routes
	app.router = new app.Routers.Router();
	Backbone.history.start();

	a.navigateHome();


});



