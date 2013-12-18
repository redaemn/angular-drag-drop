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

.controller('pageController', function ($scope, dragdropService) {

  var previousDay;

  $scope.testVar = "pippo";

  $scope.appointment1 = {
    id: 1
  };
  $scope.appointment2 = {
    id: 2
  };

  $scope.days = [
    [$scope.appointment1, $scope.appointment2],
    [],
    []
  ];

  $scope.click = function() {
    $scope.appointment1.id += 1;
  };

  $scope.dragStart = function(draggable, droppable) {
    var idx;

    idx = droppable.indexOf(draggable);

    if (idx >= 0) {
      previousDay = droppable;
    }
  };

  $scope.draggableDrop = function(draggable, droppable) {
    add(draggable, droppable);
  };

  $scope.revert = function() {
    var droppableHover = dragdropService.droppableHover();
    var dragging = dragdropService.dragging();

    return !droppableHover || droppableHover.indexOf(dragging) >= 0;
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
