var app = app || {
    Models: {},
    Views: {},
    Collections: {},
    Routers: {},
    Defaults: {},
};

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {

    // List View
    // ---------------
    // Sample usage :
    // 	var listView = new app.Views.List({
    // 		collection : stories,
    // 	});
    app.Views.List = Backbone.View.extend({

        el: "#dynamic-content",

        template: _.template($('#list-view-template').html()),

        // Delegated events 
        events: {
            'click .sort': 'sortStories',
            'click .filter': 'filterStories',
            'click .more': 'fetchStories',

        },

        initialize: function () {
            ////console.log('initalizing');

            this.issue = this.options.issue;
            this.render();


            // Initial sort and filter values
            this._sort = "trending";
            this._filter = "none";
            this.tmpRefs = [];
            this.tmpPriorities = [];
            this._firstFetch = true;
            this._storyViews = [];
            
            this._storiesCache = [];
            this.numStoriesFetched = 0;



            this.render();

            // initalize collection
            this.issue = this.options.issue;
            this.collection = new app.Collections.Stories([]);
            _.bindAll(this);

            var that = this;
            this.collection.bind('add', this.add);
            this.collection.bind('remove', this.remove);
            this.collection.bind('reset', this.reset);

            this.fetchStories(20);


            var that = this;
            $('.sort').on('click', function(t){that.sortStories(t) })
            $('.filter').on('click', function(t){that.filterStories(t) })

        },

        render: function () {
            //////console.log('rendering');		
            $(this.el).empty();
            $(this.el).html((this.template()));
            //////console.log((this.template()));

            this._rendered = true;

            // Render each Story View and append them.
            var that = this;
            _(this._storyViews).each(function (view) {
                var type = view.model.toJSON().type;
                this.ul.append(view.render().el);
            });
            return this;
        },

        reset: function () {
            ////console.log('reseting');
            $('#stories').empty();
            this._storyViews = [];
                        this._storiesCache = [];
            this.numStoriesFetched = 0;

        },

        destroy: function () {
            //unbind view
            this.undelegateEvents();
            this.$el.removeData().unbind();

            //Remove view from DOM
            var that = this;
            (this._storyViews) = [];
            Backbone.View.prototype.remove.call(this);
        },

        // add individual story 
        add: function (story) {

            var view = new app.Views.ListItem({
                tagName: 'li',
                model: story
            });

            this._storyViews.push(view);

            if (this._rendered) {
                $('#stories').append(view.render().el);
            }
        },

        remove2: function (story) {
            var viewToRemove = story;
            //////console.log(viewToRemove);
            //////console.log('STORY'+story);
            this._storyViews = _(this._storyViews).without(viewToRemove);
            if (this._rendered) $(viewToRemove.el).remove();
        },

        addFilter: function (f) {
            this._filter = f;
            this.render();
        },

        // GET SNAPSHOTS (based on a certain filter, recent or trending)
        // *********
        fetchStories: function (n) {

            this.numSnapshotsFetched = 0;
            this._storiesCache=[];
            if (n === undefined || typeof (n) != "number")
                n = 20;

            var l = this.collection.length;
            var count = 0;
            if (this._sort == 'recent')
                this._fetchStoriesByRecent(n);
            else
                this._fetchStoriesByTrending(n);
        },

        sortStories: function (t) {
            if (t.toElement.id != 'recent' && t.toElement.id != 'trending') return;
            var sortBy = t.toElement.id;
            if (this._sort != sortBy) {
                this._firstFetch = true;
                this.collection.reset();
                this._sort = sortBy;
                this.fetchStories();
            }
        },

        filterStories: function (t) {
            ////console.log("ELEMENT ID" + t.toElement.id);
            if (t.toElement.id != 'twtr' && t.toElement.id != 'comp' && t.toElement.id != 'none') return;
            var filter = t.toElement.id;
            if (this._filter != filter) {
                ////console.log('filtering by '+filter);
                this._firstFetch = true;
                this.collection.reset();
                this._filter = filter;
                this.numStoriesFetched = 0;
                this._storiesCache = [];

                ////console.log(this.collection.length);
                this.fetchStories();
            }
        },

        _fetchStoriesByTrending: function (num) {

            if (num === undefined || typeof (num) != "number")
                num = 20;

            // Get ref to top 50 stories
            var ref = new Firebase('https://lebelec.firebaseio.com/hashtags/' + this.issue + '/trending');
            var that = this;

            if (this._firstFetch) {
                ref = ref.startAt();
                this._firstFetch = false;
            } else {
            	last = this.collection.at(this.collection.length - 1);
                ref = ref.startAt(last.toJSON().popularity, last.toJSON().ref);
            }

            if (num > 0) {
                ref = ref.limit(num);
            }

            // First figure out how many stories I can fetch
            this.numStoriesToFetch = null;
            ref.once('value', function (snapshot) {
                that.numStoriesToFetch = snapshot.numChildren();
            });

            this.numSnapshotsFetched = 0;

            // Then start fetching, and stop when you reach that number
            ref.on('child_added', function (snapshot, prevName) {
                if (snapshot.val() === null) {
                    ////////console.log('no found images');
                } else {
                    // Save refs to stories
                    that.tmpRefs[that.tmpRefs.length] = snapshot.val();

                    var storyref = snapshot.val();
                    // Get the story from global list of stories
                    var story = new Firebase('https://lebelec.firebaseio.com/stories/' + snapshot.val());
                    ////console.log('got story '+ story);
                    story.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            ////console.log('No found images!');
                        } else {

                            // If there is no filter, we add everything
                            ////console.log(snapshot.name());
                            var s = snapshot.val();
                            //console.log("Current filter: "+that._filter);
                            //console.log("Current type: "+s.type);
                            that.numSnapshotsFetched =that.numSnapshotsFetched+1;
                            //console.log(that.numStoriesFetched);
                            if (that._filter == "none" || s.type == that._filter) {
                                var story = new app.Models.Story({
                                    id: snapshot.name(),
                                    prevId: prevName,
                                    user: s.user,
                                    userImage: s.user_image,
                                    media: s.media,
                                    text: s.text,
                                    retweets: s.retweets,
                                    time: s.time,
                                    lat: s.lat,
                                    lon: s.lon,
                                    type: s.type,
                                    popularity: s.popularity,
                                    ref: storyref
                                });
                                that._storiesCache.push(story);
                                that.tmpPriorities[that.tmpPriorities.length] = s.popularity;

                                //console.log(that._storiesCache.length);
                                
                            }

                            // Done fetching
                            if (that.numSnapshotsFetched == that.numStoriesToFetch) {

										that._storiesCache.sort(function (a, b) {
	                                        return a.toJSON().popularity - b.toJSON().popularity;
	                                    });
	                                    //console.log(that._storiesCache);
	                                    that.collection.add(that._storiesCache);
	                                    //console.log('Added the new cache of stories');
	                                    //console.log(that.numStoriesFetched);
	                                    that.numStoriesFetched = that.numStoriesFetched + that._storiesCache.length;
	                                    that._storiesCache = [];

	                                    //console.log("STORIES FETCHED " + that.numStoriesFetched);
	                                    //console.log("STORIES TO FETCH " + num);
                            		if (that.numStoriesToFetch > 1 && that._filter!="none" && that.numStoriesFetched<num){
                            			//console.log('another fetch');
                            			that.fetchStories(20);
                            		} else {
                            			that.numStoriesFetched = 0;
                            		}

	                                    
	                                
                                }
                        }
                    });
                }
            });
            return 1;
        },


        // Get,s the next 'num' stories for the given issue
        _fetchStoriesByRecent: function (num) {

            ////console.log('fetching stories by recent');
            if (num === undefined || typeof (num) != "number")
                num = 20;

            var ref = new Firebase('https://lebelec.firebaseio.com/hashtags/' + this.issue + '/recent');
            var that = this;

            if (this._firstFetch) {
                ref = ref.startAt();
                this._firstFetch = false;
            } else {
            	last = this.collection.at(this.collection.length - 1);
                ref = ref.startAt(last.toJSON().popularity, last.toJSON().ref);
            }

            if (num > 0) {
                ref = ref.limit(num);
            }

            // First figure out how many stories I can fetch
            this.numStoriesToFetch = null;
            ref.once('value', function (snapshot) {
                //console.log('Getting ' + snapshot.numChildren() + 'more snapshots');
                that.numStoriesToFetch = snapshot.numChildren();
            });

            this._storiesCache = [];
			this.numStoriesFetched = 0;

            // Then start fetching, and stop when you reach that number
            ref.on('child_added', function (snapshot, prevName) {
                if (snapshot.val() === null) {
                    ////////console.log('no found images');
                } else {
                    // Save refs to stories
                    that.tmpRefs[that.tmpRefs.length] = snapshot.val();

                    var storyref = snapshot.val();
                    // Get the story from global list of stories
                    var story = new Firebase('https://lebelec.firebaseio.com/stories/' + snapshot.val());
                    //console.log('got story '+ story);
                    story.on('value', function (snapshot) {
                        if (snapshot.val() === null) {
                            ////console.log('No found images!');
                        } else {

                            // If there is no filter, we add everything
                            ////console.log(snapshot.name());
                            var s = snapshot.val();
                            //console.log("Current filter: "+that._filter);
                            //console.log("Current type: "+s.type);
                            that.numStoriesFetched =that.numStoriesFetched+1;
                            //console.log(that.numStoriesFetched);
                            if (that._filter == "none" || s.type == that._filter) {
                                var story = new app.Models.Story({
                                    id: snapshot.name(),
                                    prevId: prevName,
                                    user: s.user,
                                    userImage: s.user_image,
                                    media: s.media,
                                    text: s.text,
                                    retweets: s.retweets,
                                    time: s.time,
                                    lat: s.lat,
                                    lon: s.lon,
                                    type: s.type,
                                    popularity: s.priority,
                                    ref: storyref
                                });
                                that._storiesCache.push(story);
                                //console.log(that._storiesCache.length);
                                
                            }
                            if (that.numStoriesFetched == that.numStoriesToFetch) {
                                    that._storiesCache.sort(function (a, b) {
                                        return a.toJSON().popularity - b.toJSON().popularity;
                                    });
                                    //console.log(that._storiesCache);
                                    that.collection.add(that._storiesCache);
                                    //console.log('Added the new cache of stories');
                                    that.numStoriesToFetch = null;
                                }
                        }
                    });
                }
            });
            return 1;
        },

        _storeSnapshot: function (snapshot) {
            var that = this;
            if (snapshot.val() === null) {
                ////console.log('No found images!');
            } else {

                // If there is no filter, we add everything
                var s = snapshot.val();
                if (that._filter == "none" || s.type == that._filter) {
                    var story = new app.Models.Story({
                        user: s.user,
                        userImage: s.user_image,
                        media: s.media,
                        text: s.text,
                        retweets: s.retweets,
                        time: s.time,
                        lat: s.lat,
                        lon: s.lon,
                        type: s.type,
                        popularity: s.popularity
                    });
                    that.collection.add(story);
                    that.tmpPriorities[that.tmpPriorities.length] = s.priority;
                }
            }
            ////console.log(that.collection);
        }

    });


    // List Item View
    // --------------
    // The DOM element for a todo item...
    app.Views.ListItem = Backbone.View.extend({

        tagName: "li",

        id:"s0",

        template: _.template($('#list-item-template').html()),
        imagetemplate: _.template($('#list-item-image-template').html()),

        // The DOM events specific to an item.
        // decide on these later
        events: {
            // "click .toggle"   : "toggleDone",
            // "dblclick .view"  : "edit",
            // "click a.destroy" : "clear",
            // "keypress .edit"  : "updateOnEnter",
            // "blur .edit"      : "close"
        },

        // The ListElement listens for changes to its model, re-rendering.
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.render();
        },

        // Re-render the titles of the todo item.
        render: function () {
            if (this.model.toJSON().media == ""){
                this.$el.html(this.template(this.model.toJSON()));
            } else {
                this.$el.html(this.imagetemplate(this.model.toJSON()));
            }
            return this;
        },

        // Remove the item, destroy the model.
        remove: function () {
            this.model.destroy();
        }

    });

});