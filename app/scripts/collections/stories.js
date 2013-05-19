  var app = app || {
      Models: {},
      Views: {},
      Collections: {},
      Routers: {},
      Defaults: {},
  };
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){



  // Stories Collection
  // ---------------


  app.Collections.Stories = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.Models.Story

  });

});