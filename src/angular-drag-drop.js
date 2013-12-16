/* global angular */

/*
 * TODO:
 * - don't use $position anymore, use mouse events
 * - improve draggable interface
 * - improve demo
 */

angular.module('angular-drag-drop', ['ui.bootstrap.position'])

.factory('dragdropService', [function() {
  var droppables = [],
    dragging = false,
    droppableHover = false;
  
  function addDroppable(droppable) {
    droppables.push(droppable);
  }
  
  function removeDroppable(droppable) {
    // TODO
  }
  
  function dragStart(pageX, pageY, draggable) {
    dragging = draggable;
    angular.forEach(droppables, function(droppable) {
      droppable.dragStart(pageX, pageY, draggable);
    });
  }
  
  function drag(pageX, pageY, draggable) {
    var isOverDroppable = false;
    
    angular.forEach(droppables, function(droppable) {
      if ( droppable.drag(pageX, pageY, draggable) ) {
        isOverDroppable = droppable.model;
      }
    });
    
    droppableHover = isOverDroppable;
  }
  
  function dragStop(pageX, pageY, draggable) {
    angular.forEach(droppables, function(droppable) {
      droppable.dragStop(pageX, pageY, draggable);
    });
    dragging = false;
    droppableHover = false;
  }
  
  function isDragging() {
    return dragging;
  }
  
  function isDroppableHover() {
    return droppableHover;
  }
  
  return {
    addDroppable: addDroppable,
    dragStart: dragStart,
    drag: drag,
    dragStop: dragStop,
    dragging: isDragging,
    droppableHover: isDroppableHover
  };
}])

.directive('draggable', ['$document', 'dragdropService', function($document, dragdropService) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<span ng-transclude></span>',
    replace: false,
    scope: {
      draggable: '=',
      dragStart: '&',
      drag: '&',
      dragStop: '&',
      revert: '&'
    },
    link: function link ($scope, $element, $attrs) {
      var lastPosition,
        startingPosition;
      
      $element.bind('mousedown', dragStart);
      
      $element.css({
        cursor: 'move',
        'z-index': 10000
      });
      
      setupPosition();
      
      function setupPosition() {
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
      }
      
      function dragStart(e) {
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
        
        $scope.dragStart({
          pageX: e.pageX,
          pageY: e.pageY,
          draggable: $scope.draggable
        });
        $scope.$apply();
        dragdropService.dragStart(e.pageX, e.pageY, $scope.draggable);
        
        $document.bind('mousemove', drag);
        $document.bind('mouseup', dragStop);
        
        e.preventDefault();
      }
      
      function drag(e) {
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
        
        $scope.drag({
          pageX: e.pageX,
          pageY: e.pageY,
          draggable: $scope.draggable
        });
        $scope.$apply();
        dragdropService.drag(e.pageX, e.pageY, $scope.draggable);
      }
      
      function dragStop(e) {
        $document.unbind('mouseup', dragStop);
        $document.unbind('mousemove', drag);
        
        if ($scope.revert()) {
          $element.css({
            top: startingPosition.top,
            left: startingPosition.left
          });
          // TODO: how to handle revert?
          dragdropService.drag(startingPosition.pageX, startingPosition.pageY, $scope.draggable);
          dragdropService.dragStop(startingPosition.pageX, startingPosition.pageY, $scope.draggable);
        }
        else {
          $scope.dragStop({
            pageX: e.pageX,
            pageY: e.pageY,
            draggable: $scope.draggable
          });
          $scope.$apply();
          dragdropService.dragStop(e.pageX, e.pageY, $scope.draggable);
        }
        
        lastPosition = undefined;
        $element.css('z-index', 10000);
      }
    }
  };
}])

.directive('droppable', ['dragdropService', '$position', '$document', function(dragdropService, $position, $document) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div ng-transclude></div>',
    replace: false,
    scope: {
      droppable: '=',
      dragStart: '&',
      draggableEnter: '&',
      draggableHover: '&',
      draggableDrop: '&',
      draggableLeave: '&',
      dragStop: '&'
    },
    link: function link ($scope, $element, $attrs) {
        
      $scope.isDraggableOver = false;
      
      function dragStart(pageX, pageY, draggable) {
        $scope.dragStart({
          pageX: pageX,
          pageY: pageY,
          draggable: draggable,
          droppable: $scope.droppable
        });
        if (isOverMe(pageX, pageY)) {
          $scope.isDraggableOver = true;
          $scope.$parent.$apply();
        }
      }
      
      function drag(pageX, pageY, draggable) {
        
        if (isOverMe(pageX, pageY) && !$scope.isDraggableOver) {
          $scope.isDraggableOver = true;
          $scope.$apply();
          
          $scope.draggableEnter({
            pageX: pageX,
            pageY: pageY,
            draggable: draggable,
            droppable: $scope.droppable
          });
        }
        else if (isOverMe(pageX, pageY) && $scope.isDraggableOver) {
          $scope.draggableHover({
            pageX: pageX,
            pageY: pageY,
            draggable: draggable,
            droppable: $scope.droppable
          });
        }
        else if (!isOverMe(pageX, pageY) && $scope.isDraggableOver) {
          $scope.isDraggableOver = false;
          $scope.$apply();
          
          $scope.draggableLeave({
            pageX: pageX,
            pageY: pageY,
            draggable: draggable,
            droppable: $scope.droppable
          });
        }
        /*else if (!isOverMe(pageX, pageY) && !$scope.isDraggableOver) {
          $scope.drag(pageX, pageY, draggable, $scope.droppable);
        }*/
        
        return $scope.isDraggableOver;
      }
      
      function dragStop(pageX, pageY, draggable) {
        if ($scope.isDraggableOver) {
          $scope.isDraggableOver = false;
          $scope.draggableDrop({
            pageX: pageX,
            pageY: pageY,
            draggable: draggable,
            droppable: $scope.droppable
          });
          $scope.$apply();
        }
        
        $scope.dragStop({
          pageX: pageX,
          pageY: pageY,
          draggable: draggable,
          droppable: $scope.droppable
        });
      }
      
      function isOverMe(pageX, pageY) {
        var offset = $position.offset($element),
          isOver;
        
        isOver = pageX > offset.left &&
          pageX < offset.left + offset.width &&
          pageY > offset.top &&
          pageY < offset.top + offset.height;
           
        return isOver;
      }
      
      dragdropService.addDroppable({
        dragStart: dragStart,
        drag: drag,
        dragStop: dragStop,
        model: $scope.droppable
      });
    }
  };
}]);
