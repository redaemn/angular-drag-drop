angular.module('app', ['angular-drag-drop']);

function pageController($scope, dragdropService) {

  var previousDay;

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

  $scope.draggableEnter = function(draggable, droppable) {
    //debugger;
    add(draggable, droppable);
  };

  $scope.draggableLeave = function(draggable, droppable) {
    remove(draggable, droppable);
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
    //debugger;
    var droppableHover = dragdropService.droppableHover();
    var dragging = dragdropService.dragging();

    return !droppableHover || droppableHover.indexOf(dragging) >= 0;
  };

  function add(draggable, droppable) {
    //debugger;
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
}
