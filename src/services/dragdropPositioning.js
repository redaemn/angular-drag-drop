angular.module(MODULE_NAME)

/*
 * Service used to calculate draggables and droppables positions and decide
 * whether they are positioned one above the other
 */
.factory('dragdropPositioning', ['$position', function($position) {
  // In the future, I want to have different strategies to determine whether a
  // draggable is positioned over a droppable, like jQuery UI Droppable does:
  // [http://api.jqueryui.com/droppable/#option-tolerance]
  
  function isMouseOver(pageX, pageY, droppable) {
    var offset = $position.offset(droppable.$element);
      
    return pageX > offset.left &&
      pageX < offset.left + offset.width &&
      pageY > offset.top &&
      pageY < offset.top + offset.height;
  }
  
  return {
    isMouseOver: isMouseOver
  };
  
}]);
