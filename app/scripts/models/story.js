
var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {},
};

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

	// Story Model
	// ----------

	// Our basic **Story** model has `title`, `order`, and `done` attributes.
	app.Models.Story = Backbone.Model.extend({

		// Default attributes for the todo item.
		// let : 0: tweet, 1:completure, 2:blog, 3:other
		defaults:  {
			user:"",
			userImage: "",
			text:"",
			media:"",
			retweets:0,
			lat:-1,
			lon:-1,
			time:"",
			type: -1,
		}

	});
});