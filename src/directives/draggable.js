dragdropModule.directive('draggable', [
          '$document', '$parse', 'redDragdropManager',
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
