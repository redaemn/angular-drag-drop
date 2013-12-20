/* global angular */

/* Freely inspired by jQuery UI Draggable and Droppable widgets */

/*
 * TODO:
 * - revert position with animation using ng-animate
 * - retrieve initial draggable styles
 * - constrain draggable movement (horizontal, vertical, only inside a container)
 * - draggable clone while dragging
 * - drag-drop-group to match draggables with droppables
 */

angular.module('angular-drag-drop', ['ui.bootstrap.position'])

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
}])

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
  
}])

.directive('draggable', [
          '$document', '$parse', 'dragdropManager',
  function($document,   $parse,   dragdropManager) {
    
  return {
    restrict: 'A',
    controller: function() {
      var draggableHandle;
      
      this.getSetDraggableHandle = function (handle) {
        if (angular.isDefined(handle)) {
          draggableHandle = handle;
        }
        
        return draggableHandle;
      };
    },
    link: function link ($scope, $element, $attrs, ctrl) {
      
      // PUBLIC INTERFACE VIA ATTRIBUTES
      
      // the model object associated with this draggable
      var getDraggableModel = $parse($attrs.draggable);
      
      // callback to call on drag-start event
      var dragStartCb = $parse($attrs.dragBegin); // CRAZY!! angular does not allow attributes ending with "-start"!!!
      
      // callback to call on drag event
      var dragCb = $parse($attrs.drag);
      
      // callback to call on drag-stop event
      var dragStopCb = $parse($attrs.dragStop);
      
      // callback called to decide whether to revert the draggable to the
      // starting position when drag stops
      var revertOnStopCb = $parse($attrs.revertOnStop);
      
      // PRIVATE VARS
      
      var draggable = {
        $element: $element,
        getModel: function() {
          return getDraggableModel($scope);
        }
      };
      
      var lastPosition,
        startingPosition,
        draggableHandle = ctrl.getSetDraggableHandle() || $element;
      
      draggableHandle.css({
        cursor: 'move',
      });
      
      $element.css({
        'z-index': 10000 // TODO: by default, get this from element current style
      });
      
      (function setupStyles() {
        // TODO: use window.getComputedStyle($element[0]) to get stylesheet styles
        var position = $element.css('position');
        var top = $element.css('top');
        var left = $element.css('left');
        
        if (position === '' || position === 'auto') {
          $element.css('position', 'relative');
        }
        
        if (top === '') {
          $element.css('top', '0px');
        }
        
        if (left === '') {
          $element.css('left', '0px');
        }
      })();
      
      draggableHandle.bind('mousedown', mousedown);
      
      function mousedown(e) {
        startingPosition = {
          pageX: e.pageX,
          pageY: e.pageY,
          'top': $element.css('top'),
          'left': $element.css('left')
        };
        
        $element.css('z-index', 10001);
        
        lastPosition = {
          pageX: e.pageX,
          pageY: e.pageY
        };
        
        dragStart(e.pageX, e.pageY);
        
        $document.bind('mousemove', mousemove);
        $document.bind('mouseup', mouseup);
        
        e.preventDefault();
      }
      
      function mousemove(e) {
        var elemTop = parseInt($element.css('top'), 10),
          elemLeft = parseInt($element.css('left'), 10);
        
        $element.css({
          'top': (elemTop + (e.pageY - lastPosition.pageY)) + 'px',
          'left': (elemLeft + (e.pageX - lastPosition.pageX)) + 'px'
        });
        
        lastPosition = {
          pageX: e.pageX,
          pageY: e.pageY
        };
        
        drag(e.pageX, e.pageY);
      }
      
      function mouseup(e) {
        $document.unbind('mouseup', mouseup);
        $document.unbind('mousemove', mousemove);
        
        if ($scope.$apply(revertOnStopCb)) {
          $element.css({
            top: startingPosition.top,
            left: startingPosition.left
          });
          
          drag(startingPosition.pageX, startingPosition.pageY);
          dragStop(startingPosition.pageX, startingPosition.pageY);
        }
        else {
          dragStop(e.pageX, e.pageY);
        }
        
        lastPosition = undefined;
        $element.css('z-index', 10000);
      }
      
      function dragStart(pageX, pageY) {
        dragdropManager.dragStart(pageX, pageY, draggable);
        
        dragStartCb($scope, {
          pageX: pageX,
          pageY: pageY,
          draggable: getDraggableModel($scope)
        });
        $scope.$apply();
      }
      
      function drag(pageX, pageY) {
        dragdropManager.drag(pageX, pageY, draggable);
        
        dragCb($scope, {
          pageX: pageX,
          pageY: pageY,
          draggable: getDraggableModel($scope)
        });
        $scope.$apply();
      }
      
      function dragStop(pageX, pageY) {
        dragStopCb($scope, {
          pageX: pageX,
          pageY: pageY,
          draggable: getDraggableModel($scope)
        });
        $scope.$apply();
        
        dragdropManager.dragStop(pageX, pageY, draggable);
      }
    }
  };
}])

.directive('draggableHandle', [function() {
  return {
    restrict: 'A',
    require: '^draggable',
    link: function link ($scope, $element, $attrs, draggableCtrl) {
      draggableCtrl.getSetDraggableHandle($element);
    }
  };
}])

.directive('droppable', [
          '$document', '$parse', 'dragdropManager', 'dragdropPositioning',
  function($document,   $parse,   dragdropManager,   dragdropPositioning) {
    
  return {
    restrict: 'A',
    scope: true,
    link: function link ($scope, $element, $attrs) {
        
      // PUBLIC INTERFACE VIA ATTRIBUTES
      
      // the model object associated with this droppable
      var getDroppableModel = $parse($attrs.droppable);
      
      // callback to call when a draggable enters this droppable
      var draggableEnterCb = $parse($attrs.draggableEnter);
      
      // callback to call when a draggable is hovering over this droppable
      var draggableHoverCb = $parse($attrs.draggableHover);
      
      // callback to call when a draggable is dropped over this droppable
      var draggableDropCb = $parse($attrs.draggableDrop);
      
      // callback to call when a draggable leaves this droppable
      var draggableLeaveCb = $parse($attrs.draggableLeave);
      
      // PUBLIC PROPERTIES
      
      // will be true while a draggable is being dragged over this droppable
      $scope.isDraggableHover = false;
      
      // PRIVATE VARS
      
      var droppable = {
        dragStart: dragStart,
        drag: drag,
        dragStop: dragStop,
        $element: $element,
        getModel: function() {
          return getDroppableModel($scope);
        }
      };
      
      dragdropManager.registerDroppable(droppable);
      
      $element.on('$destroy', function(){
        dragdropManager.unregisterDroppable(droppable);
      });
      
      // I CAN'T USE MOUSE EVENTS BECAUSE THEY DON'T FIRE ON THE DROPPABLE
      function dragStart(pageX, pageY, draggable) {
        if (dragdropPositioning.isMouseOver(pageX, pageY, droppable)) {
          $scope.isDraggableHover = true;
          dragdropManager._setCurrentDroppable(droppable);
          $scope.$apply();
        }
      }
      
      function drag(pageX, pageY, draggable) {
        var isMouseOverDroppable = dragdropPositioning.isMouseOver(pageX, pageY, droppable);
        
        if (isMouseOverDroppable && !$scope.isDraggableHover) {
          $scope.isDraggableHover = true;
          dragdropManager._setCurrentDroppable(droppable);
          
          draggableEnterCb($scope, {
            pageX: pageX,
            pageY: pageY,
            draggable: draggable.getModel(),
            droppable: getDroppableModel($scope)
          });
          
          $scope.$apply();
        }
        else if (isMouseOverDroppable && $scope.isDraggableHover) {
          draggableHoverCb($scope, {
            pageX: pageX,
            pageY: pageY,
            draggable: draggable.getModel(),
            droppable: getDroppableModel($scope)
          });
          
          $scope.$apply();
        }
        else if (!isMouseOverDroppable && $scope.isDraggableHover) {
          $scope.isDraggableHover = false;
          dragdropManager._setCurrentDroppable(undefined);
          
          draggableLeaveCb($scope, {
            pageX: pageX,
            pageY: pageY,
            draggable: draggable.getModel(),
            droppable: getDroppableModel($scope)
          });
          
          $scope.$apply();
        }
      }
      
      function dragStop(pageX, pageY, draggable) {
        if ($scope.isDraggableHover) {
          $scope.isDraggableHover = false;
          draggableDropCb($scope, {
            pageX: pageX,
            pageY: pageY,
            draggable: draggable.getModel(),
            droppable: getDroppableModel($scope)
          });
          $scope.$apply();
        }
      }
      
    }
  };
}]);
