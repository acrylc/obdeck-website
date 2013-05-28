var app = app || {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Defaults: {},
};

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {

	app.Views.Map = Backbone.View.extend({

		// Bind to a div for visualizations
		// el: "#dynamic-content",

		// Delegated events 
		events: {},

		initialize: function () {

			$(this.el).html('');
			console.log((this));
			$(this.el).html("<div id='map-vis'></div>");
			this.issue = this.options.issue;
			var that = this;

			if (this.options.zoomLevel == undefined){
				this.zoomLevel = 8;
			} else {
				this.zoomLevel = this.options.zoomLevel;
			}
			this.map = app.MyMap.init(this.zoomLevel);
			 this.map.scrollWheelZoom.disable();
			this.map.doubleClickZoom.enable();

			// we have 18 zoom levels (2-19)
			this.markers = [];
			this._markers = [];
			this._layers = [];
			this._currentlayer = 1;
			for (i=0;i<23;i++) this._layers[i] = new L.featureGroup([]);
			this._layers[1].addTo(this.map);
			// this._zoomthresholds = [0,0.05, 10];
			for (i=0;i<23;i++) this._markers[i] = [];
			this._stories = [];
			this.render();
			this.fetchStories();

			this.map.on('zoomend', function(){
				_(that._layers).each( function(layer) { that.map.removeLayer(layer);} );
				that._currentlayer = that.map.getZoom();
				that._layers[ that._currentlayer ].addTo(that.map);

				// if (that.map.getZoom()<4) {
				// 	that._currentlayer=2;
				// 	that._layers[ that._currentlayer ].addTo(that.map);
				// } else  if ( that.map.getZoom()>=4 && that.map.getZoom()<12){
				// 	that._currentlayer=1;
				// 	that._layers[ that._currentlayer ].addTo(that.map);
				// } else  {
				// 	that._currentlayer=0;
				// 	that._layers[ that._currentlayer ].addTo(that.map);
				// } 
			});

		},

		reset: function () {
			$("#stories-visual").empty();
			this._storyViews = [];
		},

		destroy: function () {
			this.undelegateEvents();
			this.$el.removeData().unbind();
			var that = this;
			Backbone.View.prototype.remove.call(this);
		},

		// add individual story 
		add: function (story) {

			var that = this;
			var ref = this._stories.push(story)-1;
			var radius = 25;

			for (var i=0;i<23;i++) {
				marker = undefined;
				var marker = _(this._markers[i]).find(function (marker) {
					pt1 = that.map.project( [marker.circle._latlng.lng, marker.circle._latlng.lat] , i );
					pt2 = that.map.project( [story.toJSON().lon, story.toJSON().lat] , i );
					return (marker.circle != undefined && ( Math.abs(pt1.x-pt2.x) <= (radius*1.2) ) && 
						( Math.abs(pt1.y-pt2.y) <=  (radius*1.2) ));
				});


				// if not found, add it
				if (marker == undefined) {
					console.log("new one");

					var markerOptions = {
							radius: 15,
							fillColor: "#f66a79",
							color: "#f6dad9",
							weight:1,
							opacity: 1,
							fillOpacity: 0.85
					};

					var circle = L.circleMarker( new L.LatLng(story.toJSON().lat,story.toJSON().lon) , markerOptions);
					var counter = 0;
					var refs = [];
					refs.push(ref);

					popup = this.viewPopup(story);
					var that = this;
					marker = {
						'circle': circle, 'counter':counter, 'refs':refs
					};
					var id = this._markers[i].length;
					var nextbutton = $('<input type="button" class="popup-next" id="' + id + ' " value="Next">').click(function () {
						id = Number(this.getAttribute("id"));
						len = that._markers[that._currentlayer][id].refs.length;
						counter = (counter + 1)%len;
						console.log(len);
						$('#innerpopup').html( that.viewPopup( that._stories[that._markers[that._currentlayer][id].refs[counter]] ) );
					})[0];

					var t = $(popup).append(nextbutton);
					circle.bindPopup((t[0]));
					this._markers[i].push(marker);
					this._layers[i].addLayer(circle);

				} else {
					marker.circle.setStyle({radius: marker.circle.options.radius+0.2 });
					marker.refs.push(ref);
				}
			}

		},

		remove: function (story) {
			var viewToRemove = _(this._storyViews).select(function (cv) {
				return cv.model === model;
			})[0];
			this._storyViews = _(this._storyViews).without(viewToRemove);
			if (this._rendered) $(viewToRemove.el).remove();
		},

		render: function () {

			this._rendered = true;
			return this;
		},

		fetchStories: function (num) {

			if (num === undefined || typeof (num) != "number")
				num = 20;

			// Get ref to top 50 stories
			var ref = new Firebase('https://lebelec.firebaseio.com/hashtags/' + this.issue + '/trending');
			var that = this;

			ref = ref.startAt();

			// Then start fetching, and stop when you reach that number
			ref.on('child_added', function (snapshot, prevName) {
				if (snapshot.val() === null) {} else {

					var storyref = snapshot.val();
					// Get the story from global list of stories
					var story = new Firebase('https://lebelec.firebaseio.com/stories/' + snapshot.val());
					//console.log('got story '+ story);
					story.on('value', function (snapshot) {
						if (snapshot.val() === null) {
							//console.log('No found images!');
						} else {

							var s = snapshot.val();
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
							that.add(story);
						}
					});
				}
			});
			return 1;
		}, 

		viewPopup: function(story){
			if (story.toJSON().media=="" || story.toJSON().media==undefined){
			str = "<div class='popup' id='<%-id%>' > <div id='innerpopup'> "
				+ "<div id='popup-content-text'>"
                + "<p id='text'> <%-text%> </p>"
                + "</div>"
                + " <div id='popup-meta'>"
                + " <span style='display:inline-block'> <img id='user-image' src='<%-userImage%>' </span>"
                + " <span style='display:inline-block'>  <p id='user'> <a href='http://twitter.com/<%-user%>'> <%-user%> </a> </p>"
                + "   <p id='time'> <%-time%> </p> </span>"
                // + "   <p id='popularity'> <%-lon%> </p> "
                // + "   <p id='popularity'> <%-lat%> </p> "
                + "</div> </div>"
            	+ "</div>";

			} else 
			str = "<div class='popup' id='<%-id%>' > <div id='innerpopup'> "
				+ "<div id='popup-content-image'>"
                + "<p id='text'> <%-text%> </p>"
                + "<img id='meda' src=" + '"<%-media%>"'+ ">"
                + "</div>"
                + " <div id='popup-meta'>"
                + " <span style='display:inline-block'> <img id='user-image' src='<%-userImage%>' </span>"
                + " <span style='display:inline-block'>  <p id='user'> <a href='http://twitter.com/<%-user%>'> <%-user%> </a> </p>"
                + "   <p id='time'> <%-time%> </p> </span>"
                // + "   <p id='popularity'> <%-lon%> </p> "
                // + "   <p id='popularity'> <%-lat%> </p> "
                + "</div> </div>"
            	+ "</div>";
			template = _.template(str);
			return template(story.toJSON());
		}

	});

});