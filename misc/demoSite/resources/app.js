angular.module('app', ['angular-drag-drop'])

.controller('simpleDraggableCtrl', function($scope) {
  
  $scope.draggableModel = {
    num: 0
  };
  
  $scope.dragStatus = "stop";
  
  $scope.revertToStart = true;
  $scope.resetOnStop = true;
  
  $scope.dragStart = function(x, y, draggable) {
    $scope.dragStatus = "dragging";
  };
  
  $scope.drag = function(x, y, draggable) {
    draggable.num++;
  };
  
  $scope.dragStop = function(x, y, draggable) {
    $scope.dragStatus = "stop";
    if ($scope.resetOnStop) {
      $scope.draggableModel = {
        num: 0
      };
    }
  };
  
  $scope.revertOnStop = function() {
    return $scope.revertToStart;
  };
  
})

.controller('draggableEventsController', function($scope) {
  
  $scope.draggableModel = {
    num: 0
  };
  
  $scope.dragStart = function(x, y, draggable) {
    console.log('drag-start: [' + x + ', ' + y + '] - ' + draggable.num);
  };
  
  $scope.drag = function(x, y, draggable) {
    draggable.num++;
    console.log('drag: [' + x + ', ' + y + '] - ' + draggable.num);
  };
  
  $scope.dragStop = function(x, y, draggable) {
    console.log('drag-stop: [' + x + ', ' + y + '] - ' + draggable.num);
  };
})

.controller('draggablesAndDroppablesController', function ($scope, dragdropManager) {

  var previousDay;

  $scope.appointment1 = {
    id: 1,
    isReverting: false
  };
  $scope.appointment2 = {
    id: 2,
    isReverting: false
  };

  $scope.days = [
    [$scope.appointment1, $scope.appointment2],
    [],
    []
  ];

  $scope.click = function() {
    $scope.appointment1.id += 1;
  };

  $scope.dragStart = function(draggable) {
    var idx,
      droppable = dragdropManager.getCurrentDroppable();
      
    draggable.isReverting = false;

    idx = droppable.indexOf(draggable);

    if (idx >= 0) {
      previousDay = droppable;
    }
  };

  $scope.draggableDrop = function(draggable, droppable) {
    add(draggable, droppable);
  };

  $scope.revert = function() {
    var droppable = dragdropManager.getCurrentDroppable();
    var draggable = dragdropManager.getCurrentDraggable();

    var isReverting = !droppable || droppable.indexOf(draggable) >= 0;
    
    if (isReverting) {
      draggable.isReverting = true;
    }
    
    return isReverting;
  };

  function add(draggable, droppable) {
    if (droppable.indexOf(draggable) < 0) {
      remove(draggable, previousDay);
      droppable.push(draggable);
    }

    $scope.$apply();
  }

  function remove(draggable, droppable) {
    var idx;

    idx = droppable.indexOf(draggable);

    if (idx >= 0) {
      droppable.splice(idx, 1);
    }

    $scope.$apply();
  }
});
