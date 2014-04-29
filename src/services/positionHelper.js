/*
 * A set of utility methods that can be use to retrieve position of DOM elements.
 *
 * This code is taken from the AngularUI Bootstrap project [http://angular-ui.github.io/bootstrap/]
 * Copyright (c) 2012-2014 the AngularUI Team [https://github.com/angular-ui/bootstrap/blob/master/LICENSE]
 */
dragdropModule.factory('positionHelper', ['$document', '$window', function($document, $window) {

  return {
    /**
     * Provides read-only equivalent of jQuery's offset function:
     * http://api.jquery.com/offset/
     */
    offset: function (element) {
      var boundingClientRect = element[0].getBoundingClientRect();
      return {
        width: boundingClientRect.width || element.prop('offsetWidth'),
        height: boundingClientRect.height || element.prop('offsetHeight'),
        top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
        left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
      };
    }
  };
  
}]);
