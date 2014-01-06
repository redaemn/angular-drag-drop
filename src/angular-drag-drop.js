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
