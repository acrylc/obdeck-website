$(function(){



  // Stories Collection
  // ---------------


 app.Routers.Router = Backbone.Router.extend({

	routes: {
		'': 'main',
		
		// product landing page, ex. /products/sofas
		':type/:id' : 'displayDynamicPage',

		':type' : 'displayPage'
	},

	main: function(){
		console.log('routing to cover page');
	},

	displayDynamicPage: function(type, id){
		console.log('Fetching stories for '+type + ' ' + id);
		id = id.toLowerCase();
		 app.vent.trigger('displayIssue', id);
	},

	displayPage: function(type){
		console.log('going to '+type);

		if (type == 'issues'){
			console.log('going to issues');
			app.vent.trigger('displayIssuesPage');
		}
	},


	default : function(){
		console.log('404');
	}
	

});


});