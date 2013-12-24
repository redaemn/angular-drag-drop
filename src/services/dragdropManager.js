angular.module(MODULE_NAME)

/*
 * Service used to make draggables interact with droppables; it maintains the
 * global state of the drag-drop operation
 */
.factory('dragdropManager', [function() {
  var currentDraggable,
    currentDroppable,
    registeredDroppables = [];
  
  function dragStart(pageX, pageY, draggable) {
    currentDraggable = draggable;
    
    angular.forEach(registeredDroppables, function(droppable) {
        droppable.dragStart(pageX, pageY, draggable);
    });
  }
  
  function drag(pageX, pageY, draggable) {
    angular.forEach(registeredDroppables, function(droppable) {
        droppable.drag(pageX, pageY, draggable);
    });
  }
  
  function dragStop(pageX, pageY, draggable) {
    angular.forEach(registeredDroppables, function(droppable) {
        droppable.dragStop(pageX, pageY, draggable);
    });
    
    currentDraggable = currentDroppable = undefined;
  }
  
  function registerDroppable(droppable) {
    var idx;

    idx = registeredDroppables.indexOf(droppable);

    if (idx < 0) {
      registeredDroppables.push(droppable);
    }
  }
  
  function unregisterDroppable(droppable) {
    var idx;

    idx = registeredDroppables.indexOf(droppable);

    if (idx >= 0) {
      registeredDroppables.splice(idx, 1);
    }
  }
  
  function getCurrentDraggable() {
    return currentDraggable ? currentDraggable.getModel() : undefined;
  }
  
  function getCurrentDroppable() {
    return currentDroppable ? currentDroppable.getModel() : undefined;
  }
  
  function setCurrentDroppable(droppable) {
    currentDroppable = droppable;
  }
  
  return {
    dragStart: dragStart,
    drag: drag,
    dragStop: dragStop,
    registerDroppable: registerDroppable,
    unregisterDroppable: unregisterDroppable,
    getCurrentDraggable: getCurrentDraggable,
    getCurrentDroppable: getCurrentDroppable,
    _setCurrentDroppable: setCurrentDroppable
  };
}]);
