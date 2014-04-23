/*
 * angular-drag-drop v0.0.1 [https://github.com/redaemn/angular-drag-drop]
 * 2014-04-23
 *
 * This software is licensed under The MIT License (MIT)
 * Copyright (c) 2014 Gabriele Rabbiosi [https://plus.google.com/+GabrieleRabbiosi/]
 * [https://github.com/redaemn/angular-drag-drop/blob/master/LICENSE]
 */


(function(angular, undefined) {

/* Freely inspired by jQuery UI Draggable and Droppable widgets */

/*
 * TODO:
 * - revert position with animation using ng-animate
 * - retrieve initial draggable styles
 * - constrain draggable movement (horizontal, vertical, only inside a container)
 * - draggable clone while dragging
 * - drag-drop-group to match draggables with droppables
 */

var dragdropModule = angular.module('angular-drag-drop', ['ui.bootstrap.position']);

dragdropModule.directive('draggable', [
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
      
      draggableHandle.bind('touchstart mousedown', mousedown);

      function getEventPosition(e) {
        var posObj = e.type.indexOf('touch') === 0 ? e.changedTouches[0] : e;

        return {
          x: posObj.pageX,
          y: posObj.pageY
        };
      }
      
      function mousedown(e) {
        e.preventDefault();

        var eventPosition = getEventPosition(e);

        startingPosition = {
          pageX: eventPosition.x,
          pageY: eventPosition.y,
          'top': $element.css('top'),
          'left': $element.css('left')
        };
        
        $element.css('z-index', 10001);
        
        lastPosition = {
          pageX: eventPosition.x,
          pageY: eventPosition.y
        };
        
        dragStart(eventPosition.x, eventPosition.y);
        
        $document.bind('touchmove mousemove', mousemove);
        $document.bind('touchend mouseup', mouseup);
      }
      
      function mousemove(e) {
        e.preventDefault();

        var elemTop = parseInt($element.css('top'), 10),
          elemLeft = parseInt($element.css('left'), 10),
          eventPosition = getEventPosition(e);
        
        $element.css({
          'top': (elemTop + (eventPosition.y - lastPosition.pageY)) + 'px',
          'left': (elemLeft + (eventPosition.x - lastPosition.pageX)) + 'px'
        });
        
        lastPosition = {
          pageX: eventPosition.x,
          pageY: eventPosition.y
        };
        
        drag(eventPosition.x, eventPosition.y);
      }
      
      function mouseup(e) {
        e.preventDefault();

        var eventPosition = getEventPosition(e);

        $document.unbind('touchend mouseup', mouseup);
        $document.unbind('touchmove mousemove', mousemove);
        
        if ($scope.$apply(revertOnStopCb)) {
          $element.css({
            top: startingPosition.top,
            left: startingPosition.left
          });
          
          drag(startingPosition.pageX, startingPosition.pageY);
          dragStop(startingPosition.pageX, startingPosition.pageY);
        }
        else {
          dragStop(eventPosition.x, eventPosition.y);
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
}]);

dragdropModule.directive('draggableHandle', [function() {
  return {
    restrict: 'A',
    require: '^draggable',
    link: function link ($scope, $element, $attrs, draggableCtrl) {
      draggableCtrl.getSetDraggableHandle($element);
    }
  };
}]);

// I can't implement droppable using mouse events because they don't fire on
// the droppable element (because there's the draggable between it and the mouse)
dragdropModule.directive('droppable', [
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

/*
 * Service used to make draggables interact with droppables; it maintains the
 * global state of the drag-drop operation
 */
dragdropModule.factory('dragdropManager', [function() {
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

/*
 * Service used to calculate draggables and droppables positions and decide
 * whether they are positioned one above the other
 */
dragdropModule.factory('dragdropPositioning', ['$position', function($position) {
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


})(window.angular);
