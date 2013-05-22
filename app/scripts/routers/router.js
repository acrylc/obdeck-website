$(function(){



  // Stories Collection
  // ---------------


 app.Routers.Router = Backbone.Router.extend({

	routes: {
		'': 'main',
		
		// product landing page, ex. /products/sofas
		':id' : 'displayDynamicPage'
	},

	main: function(){
		console.log('routing to cover page');
	},

	displayDynamicPage: function(id){
		console.log('Fetching stories for '+id);
		id = id.toLowerCase();
		app.vent.trigger('displayIssue', id);
	},

	default : function(){
		console.log('404');
	}
	

});


});