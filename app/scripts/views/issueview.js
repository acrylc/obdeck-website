var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {}
};


$(function(){

	/* IssueView
	 * Extends Backbone.View
	 * Pass an issue object, will create a issue page
	 * Consisting of : 
	 *  	- An event timeline (timelineJS)
	 * 		- Editorial content section
	 * 		- Key players section
	 * 		- Story timeline (of tweets)
	 * 	
	 * var view = new app.Views.StoryVisualization({issue : "bribery"});
	 */

	app.Views.IssueView = Backbone.View.extend({

		el: "#content",

		template: _.template( $('#home-view-template').html() ),
		keyPlayerTemplate: _.template( $('#keyplayer-template').html() ),
		socialTimelineTemplate: _.template( $('#vtimelinerow-template').html() ),

		events: {
		},

		initialize: function() {		
			this.render();
			this.renderEventTimeline();
			this.renderSocialTimeline();
			this.renderKeyPlayers();
			this.animateNavbar();


		},

		// Render the skeleton of the view
		render: function(){
			var that = this;
			$(this.el).empty();
			$(this.el).html((this.template({'overview':that.options.issue.overview})));
			return this;
		},

		// Render the event timeline using timelineJS and the user edited
		// gDoc passed in the issue object 
		renderEventTimeline: function(){

			// Set background image to heroImage
			var that = this;
			$('#event-timeline').css({'background-image' : ' url('+ this.options.issue.heroImage +')'});
				
			// Blur hero unit
			$('#event-timeline').blurjs({
				source: '#event-timeline',
				radius: 12,
				overlay: 'rgba(255,255,255,0.4)'
			});
			
			// Create event timeline using TimelineJS
			createStoryJS({
				type:       'timeline',
				width:      '100%',
				height:     '550',
				source:     that.options.issue.timelineDoc,
				embed_id:   'event-timeline',
				css: 'timeline-style/timeline.css'
			});
		},

		// Toggle the navbar's display (hover or static) based on scroll level
		animateNavbar: function(){
			var that = this;
			$('#navbar').show();
			this.navIsFixed = false;

			 $(window).scroll(function(){
			// get the height of #wrap
			var y = $(window).scrollTop();
				if( y >= 680 && that.navIsFixed==false ){
					that.navIsFixed= true;
					$('#navbar').hide()
					$('#navbar').addClass('floatt');
					$('#navbar').slideDown('fast');
				}
				if( y < 680 && that.navIsFixed==true ){
					that.navIsFixed=false;
					$('#navbar').slideUp('fast', function(){
						$('#navbar').removeClass('floatt');
						$('#navbar').css('display','block');
					});
				}
			});
		},


		// Render a vertical timeline of tweet 
		renderSocialTimeline: function(){
			var datelabels = ['TODAY', 'YESTERDAY', 'LAST WEEK', 'LAST MONTH', 'LAST YEAR'];
			var dates = [];

			for (var i=0;i<5;i++){
				var id = '#t'+ (i+1);
				$('#vtimeline').append('<div id="t'+ (i+1) +'" class="trow"></div>');
				var v = new app.Views.List({'el':id, 'index': i+1, 'issue':'test', 'datelabel':datelabels[i], 'date':'JULY 03 2012' });
			}

		},

		// Render the key players in the issue object
		// issue.keyPlayers
		renderKeyPlayers: function(){

			for(var i=0;i<this.options.issue.keyPlayers.length;i++){
				this.options.issue.keyPlayers[i].contact = "";
				$('#players').append( this.keyPlayerTemplate( this.options.issue.keyPlayers[i]) );
			}

		}, 



		reset: function(){
			this.visual.destroy();
		},

		destroy: function(){
			//unbind view
			this.undelegateEvents();
			this.$el.removeData().unbind(); 
			//Clear DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);
		}	

	});

});