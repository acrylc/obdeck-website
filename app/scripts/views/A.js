
// Load the application once the DOM is ready, using `jQuery.ready`
$(function(){

	var app = app || {
		Models: {},
		Views: {},
		Collections: {},
		Defaults: {},
	};

	app.Views.DynamicPage = Backbone.View.extend({

	});
	

	app.Views.IssuePage = Backbone.View.extend({

	});	

	app.Views.Map = Backbone.View.extend({

	});

	app.Views.List = Backbone.View.extend({

	});

	// Todo Item View
	// --------------
	// The DOM element for a todo item...
	app.Views.ListItem = Backbone.View.extend({

		tagName:  "li",

		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			"click .toggle"   : "toggleDone",
			"dblclick .view"  : "edit",
			"click a.destroy" : "clear",
			"keypress .edit"  : "updateOnEnter",
			"blur .edit"      : "close"
		},

		// The ListElement listens for changes to its model, re-rendering.
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		// Re-render the titles of the todo item.
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('done', this.model.get('done'));
			this.input = this.$('.edit');
			return this;
		},

		// Remove the item, destroy the model.
		clear: function() {
			this.model.destroy();
		}

	});

	


});
