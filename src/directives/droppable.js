angular.module(MODULE_NAME)

// I can't implement droppable using mouse events because they don't fire on
// the droppable element (because there's the draggable between it and the mouse)
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
