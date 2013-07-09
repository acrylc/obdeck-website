var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {}
};


// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

	// Dynamic content view
	// ---------------
	// Pass an issue hashtag, will get from Firebase corresponding data
	// and visualize dynamically in map or list view depending on set controls
	// sample usage :
	// var view = new app.Views.StoryVisualization({issue : "bribery"});
	app.Views.IssueView = Backbone.View.extend({

		el: "#content",

		template: _.template( $('#home-view-template').html() ),
		kptemplate: _.template( $('#keyplayer-template').html() ),
		vttemplate: _.template( $('#vtimelinerow-template').html() ),

		// Listen to navbar, update content accordingly
		events: {
		},

		initialize: function() {

			this.render();
			this.initEventTimeline();
			this.initNavbar();
			this.initSocialTimeline();
			 for(var i=0;i<app.issue.keyplayers.length;i++){
 				 $('#players').append( this.kptemplate( app.issue.keyplayers[i]) );
			}

		},

		// Create a blurred hero unit with a TimelineJS
		// timeline based on the doc created by editorial team
		initEventTimeline: function(){

			// Set background image to hero unit
			$('#event-timeline').css({'background-image' : ' url('+ app.issue.heroimage +')'});
				
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
				source:     app.issue.timeline_doc,
				embed_id:   'event-timeline',
				css: 'timeline-style/timeline.css'
			});
		},

		// Display navbar and change 
		// style (hover or static) based on scroll
		initNavbar: function(){
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

		initSocialTimeline: function(){
			var datelabels = ['TODAY', 'YESTERDAY', 'LAST WEEK', 'LAST MONTH', 'LAST YEAR'];
			var dates = [];

			for (var i=0;i<5;i++){
				console.log(i);
				var id = '#t'+ (i+1);
				$('#vtimeline').append('<div id="t'+ (i+1) +'" class="trow"></div>');
				var v = new app.Views.List({'el':id, 'index': i+1, 'issue':'test', 'datelabel':datelabels[i], 'date':'JULY 03 2012' });
			}

		},

		render: function(){
			$(this.el).empty();
			$(this.el).html((this.template({'overview':app.issue.overview})));
			return this;
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