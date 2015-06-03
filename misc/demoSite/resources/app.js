angular.module('app', ['red.drag-drop'])

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
  
  $scope.dragBegin = function(x, y, draggable) {
    console.log('drag-begin: [' + x + ', ' + y + '] - ' + draggable.num);
  };
  
  $scope.drag = function(x, y, draggable) {
    draggable.num++;
    console.log('drag: [' + x + ', ' + y + '] - ' + draggable.num);
  };
  
  $scope.dragStop = function(x, y, draggable) {
    console.log('drag-stop: [' + x + ', ' + y + '] - ' + draggable.num);
  };
})

.controller('draggableDroppableEventsController', function($scope) {
  
  $scope.draggableModel = {
    num: 0
  };
  
  $scope.droppableModel = {
    num: 0
  }
  
  $scope.dragBegin = function(x, y, draggable) {
    console.log('drag-begin: [' + x + ', ' + y + '] - drag: ' + draggable.num);
  };
  
  $scope.drag = function(x, y, draggable) {
    draggable.num++;
    console.log('drag: [' + x + ', ' + y + '] - drag: ' + draggable.num);
  };
  
  $scope.dragStop = function(x, y, draggable) {
    console.log('drag-stop: [' + x + ', ' + y + '] - drag: ' + draggable.num);
  };
  
  $scope.draggableEnter = function(x, y, draggable, droppable) {
    console.log('draggable-enter: [' + x + ', ' + y + '] - drag: ' + draggable.num + ', drop: ' + droppable.num);
  };
  
  $scope.draggableHover = function(x, y, draggable, droppable) {
    droppable.num++;
    console.log('draggable-hover: [' + x + ', ' + y + '] - drag: ' + draggable.num + ', drop: ' + droppable.num);
  };
  
  $scope.draggableDrop = function(x, y, draggable, droppable) {
    console.log('draggable-drop: [' + x + ', ' + y + '] - drag: ' + draggable.num + ', drop: ' + droppable.num);
  };
  
  $scope.draggableLeave = function(x, y, draggable, droppable) {
    console.log('draggable-leave: [' + x + ', ' + y + '] - drag: ' + draggable.num + ', drop: ' + droppable.num);
  };
})

.controller('draggablesAndDroppablesController', function ($scope, redDragdropManager) {

  var previousDay;

  $scope.appointments = [];
  
  (function() {
    var i = 0;
    
    for ( ; i < 2; i++) {
      $scope.appointments.push(
        {
          id: i+1,
          animateMove: false
        }
      );
    }
    
  })();

  $scope.days = [];
  
  (function() {
    var i;
    
    for (i = 0; i < 20; i++) {
      $scope.days.push([]);
    }
    
    for (i = 0; i < $scope.appointments.length; i++) {
      $scope.days[0].push(
        $scope.appointments[i]
      );
    }
    
  })();

  $scope.increment = function(appointment) {
    appointment.id += 1;
  };
  
  $scope.decrement = function(appointment) {
    appointment.id -= 1;
  };

  $scope.dragStart = function(appointment) {
    var idx,
      day = redDragdropManager.getCurrentDroppable();
      
    appointment.animateMove = false;

    idx = day.indexOf(appointment);

    if (idx >= 0) {
      previousDay = day;
    }
  };

  $scope.draggableDrop = function(appointment, day) {
    add(appointment, day);
  };

  $scope.revert = function() {
    var currentDay = redDragdropManager.getCurrentDroppable();
    var currentAppointment = redDragdropManager.getCurrentDraggable();

    var isReverting = !currentDay || currentDay.indexOf(currentAppointment) >= 0;
    
    if (isReverting) {
      currentAppointment.animateMove = true;
    }
    
    return isReverting;
  };

  function add(appointment, day) {
    if (day.indexOf(appointment) < 0) {
      remove(appointment, previousDay);
      day.push(appointment);
    }

    $scope.$apply();
  }

  function remove(appointment, day) {
    var idx;

    idx = day.indexOf(appointment);

    if (idx >= 0) {
      day.splice(idx, 1);
    }

    $scope.$apply();
  }
});
