
var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {},
};

$(function(){


	app.Models.Issue = Backbone.Model.extend({

		// Default attributes for the todo item.
		// let : 0: tweet, 1:completure, 2:blog, 3:other
		defaults:  {
			overview: "",
			timelineDoc : "",
			heroImage : "",
			keyplayers: []
		}

	});
});