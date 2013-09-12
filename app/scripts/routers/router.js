$(function(){



  // Stories Collection
  // ---------------


 app.Routers.Router = Backbone.Router.extend({

	routes: {
		'': 'main',
		
		// product landing page, ex. /products/sofas
		':id' : 'displayIssue',

		':type' : 'displayPage'
	},

	main: function(){
		console.log('routing to cover page');
		app.vent.trigger('displayHome');
	},

	displayIssue: function(issue){	
		app.vent.trigger('displayIssue', issue);	

	},

	default : function(){
		console.log('404');
	}
	

});


});