var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {},
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

		template: _.template( $('#issue-view-template').html() ),

		// Listen to navbar, update content accordingly
		events: {
			'click .display' : 'displayStories',
		},

		initialize: function() {
			this.render();
			this.visual = new app.Views.List({"issue":this.options.issue});
			this.displayStatistics();
		},

		render: function(){
			$(this.el).empty();
			$(this.el).html((this.template()));
			return this;
		},

		reset: function(){
			////console.log('resetting');			
			this.visual.destroy();
		},

		destroy: function(){
			//unbind view
			this.undelegateEvents();
			this.$el.removeData().unbind(); 
			//Clear DOM
			this.remove();  
			Backbone.View.prototype.remove.call(this);
		},

		displayStories: function(t){
			if (t.toElement.id == 'map'){
				this.displayMap();			
			} else {
				this.display = 'list';
				this.displayList();
			} 
		},

		
		displayStatistics: function(){
			this.numStories = 0;
			this.talking = [];
			this.tags = [];
			var that = this;
			var s = {};
			this.count = 0;
			stor=[];

			            var ref5 = new Firebase('https://lebelec.firebaseio.com/hashtags/' + this.options.issue + '/trending');


        	ref5.once('value', function (snapshot) {
        		s = snapshot;
        		that.numStories = snapshot.numChildren();
        		//console.log("NUM STORIES" +that.numStories);

 ref5.on('child_added', function (snapshot, prevName) {
                if (snapshot.val() === null) {
                } else {
                	//console.log(that.talking.length);
                    var storyref = snapshot.val();
                    var story = new Firebase('https://lebelec.firebaseio.com/stories/' + snapshot.val());
                    story.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                        } else {
                           var s = snapshot.val();
                           stor[stor.length]=s;
                        }
						//console.log(that.count);
						//console.log(that.numStories);
						that.count = that.count+1;
						//console.log('NUM STORIES WE HAVE ' +stor.length);
						if (stor.length == that.numStories){

								//console.log(stor.length);
								for(var k=0;k<stor.length;k++){
									s = stor[k];
									//console.log(k);
									//console.log(stor[k]);
									var ret =  _(that.talking).find(function(t){
	                            	return t.user==s.user;
	                            });
	                            if (ret==undefined){
	                            	that.talking.push({'user':s.user, 'count':0});
	                            } else {
	                            	ret.count = ret.count+1;
	                            }
	                            ret = undefined;

	                            for(var i=0;i<s.category.length;i++){
									var ret =  _(that.tags).find(function(t){
		                            	return t.tag==s.category[i];
		                            });
		                            if (ret==undefined){
		                            	that.tags.push({'tag':s.category[i], 'count':0});
		                            } else {
		                            	ret.count = ret.count+1;
		                            }
	        					}
								}
								//console.log("LENGTH" + that.talking.length);
								$('#talkingaboutvalue').html(that.talking.length);
								$('#numstoriesvalue').html(that.numStories);
								console.log(that.tags);
								var min = _.each(that.tags, function(t1,t2){
									return (t1.count<t2.count);
								});
								console.log("MIN "+min);
								var max = _.each(that.tags, function(t1,t2){
									return (t1.count>t2.count);
								});
								console.log("MAX "+max);
								// for(var i=1;i<=20;i++){
								// 	if (that.tags[i]!=undefined){
								// 		if i<
								// 	}
								// }
							}
						});
                }
            });


            });
 
		},

		displayMap: function(){
			this.reset();
						$(this.el).append("<div id='dynamic-content'></div>");

			this.visual = new app.Views.Map({"issue":this.options.issue});
		},

		displayList: function(){
			 this.reset();
			 			$(this.el).append("<div id='dynamic-content'></div>");

			this.visual = new app.Views.List({"issue":this.options.issue});
		}		

	});

});