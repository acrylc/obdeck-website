var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {},
};

$(function(){

	
	/* AppView
	 * Extends Backbone.View
	 * God view, instantiated on document first loads
	 * var view = new app.Views.AppView({});
	 */
	app.Views.AppView = Backbone.View.extend({

		el: $("body"),

		// Listen to navbar, update content accordingly
		events: {
			"click #home":  "navigateHome",
			"click #issue": "navigateIssues", 
			"click #participate" : "navigateParticipate",
			"click #about" : "navigateAbout",

		},

		initialize: function() {
			app.vent.on('displayHome', this.navigateHome, this);
			app.vent.on('displayIssue', this.navigateIssue, this, issue);

		},

		// Creates an issue page, issue url hardcoded for now
		navigateHome: function() {

			console.log('navigating to homeview');
			var view = new app.Views.HomeView();
		},

		navigateIssue: function(issue){

			console.log('navigating to '+issue);
			app.router.navigate('/'+issue);

			// clear DOM
			$('#content').empty();

			if (issue === 'occupybeirut')
				var url =  'https://docs.google.com/spreadsheet/pub?key=0AvsGYBn6aGTpdHJOU2RCVUtDVkFsSkcxcUFHUUZDRGc&output=html';
			else
				var url = 'https://docs.google.com/spreadsheet/pub?key=0AvsGYBn6aGTpdHdvTHhhbGx3TVFDTFo2NWtmc0FTR3c&output=html';
			var that = this;
			this.fetchIssue(url, function(issue){
				var view = new app.Views.IssueView({'issue' : issue});
			});
		},

		navigateAbout: function(){
			app.router.navigate('/about');
			// var view = new app.Views.IssuePage({});
		},

		fetchIssue : function(url , callback){

			var cms = pepper(url, {
				'Name': 'string',
				'Url': 'string',
				'Content': 'string'
			});
			cms.sync()
			.then(function(data) {

				var overview = data[1].content;
				var timelineDoc = data[4].url;
				var heroImage = data[0].url;
				var keyPlayers = {};
				var url =  data[2].url;
				var that = this;
				var cms = pepper(url, {
					'Name': 'string',
					'Description': 'string',
					'Logo': 'string'
				});
				
				cms.sync()
				.then(function(data) {
					keyPlayers = data;
					var issue = new app.Models.Issue({
						'overview' : overview,
						'timelineDoc' : timelineDoc,
						'heroImage' : heroImage, 
						'keyPlayers' : keyPlayers 
					});
					callback(issue);

				})
				.fail(function (error) {
				})			})
			.fail(function (error) {
			})
		}

	});

});