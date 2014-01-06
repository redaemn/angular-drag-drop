describe('dragdropManager', function() {

  var dragdropManager, mockDroppable1, mockDroppable1Model, mockDroppable2, mockDraggable, mockDraggableModel;

  beforeEach(function() {
    module('angular-drag-drop');

    inject(function(_dragdropManager_) {
      dragdropManager = _dragdropManager_;
    });

    mockDroppable1Model = {};
    mockDroppable1 = jasmine.createSpyObj('mockDroppable1', [
      'dragStart',
      'drag',
      'dragStop'
    ]);
    mockDroppable1.getModel = function() {
      return mockDroppable1Model;
    };

    mockDroppable2 = jasmine.createSpyObj('mockDroppable2', [
      'dragStart',
      'drag',
      'dragStop'
    ]);

    mockDraggableModel = {};
    mockDraggable = {
      getModel: function() {
        return mockDraggableModel;
      }
    };

    dragdropManager.registerDroppable(mockDroppable1);
    dragdropManager.registerDroppable(mockDroppable2);
  });

  it('should have the right API', function() {
    expect(Object.keys(dragdropManager).length).toBe(8);
    expect(dragdropManager.dragStart).toEqual(jasmine.any(Function));
    expect(dragdropManager.drag).toEqual(jasmine.any(Function));
    expect(dragdropManager.dragStop).toEqual(jasmine.any(Function));
    expect(dragdropManager.registerDroppable).toEqual(jasmine.any(Function));
    expect(dragdropManager.unregisterDroppable).toEqual(jasmine.any(Function));
    expect(dragdropManager.getCurrentDraggable).toEqual(jasmine.any(Function));
    expect(dragdropManager.getCurrentDroppable).toEqual(jasmine.any(Function));
    expect(dragdropManager._setCurrentDroppable).toEqual(jasmine.any(Function));
  });

  it('should not have a currentDraggable set', function() {
    expect(dragdropManager.getCurrentDraggable()).toBeUndefined();
  });

  it('should not have a currentDroppable set', function() {
    expect(dragdropManager.getCurrentDroppable()).toBeUndefined();
  });

  describe('calling "_setCurrentDroppable"', function() {

    beforeEach(function() {
      dragdropManager._setCurrentDroppable(mockDroppable1);
    });

    it('should set the currentDroppable to the given droppable model', function() {
      expect(dragdropManager.getCurrentDroppable()).toBe(mockDroppable1Model);
    });

  });

  describe('calling "dragStart"', function() {

    beforeEach(function() {
      expect(mockDroppable1.dragStart).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStart).not.toHaveBeenCalled();

      dragdropManager.dragStart(10, 20, mockDraggable);
    });

    it('should call "dragStart" on every registered droppable, passing the right parameters', function() {
      expect(mockDroppable1.dragStart.calls.length).toBe(1);
      expect(mockDroppable1.dragStart.calls[0].args[0]).toBe(10);
      expect(mockDroppable1.dragStart.calls[0].args[1]).toBe(20);
      expect(mockDroppable1.dragStart.calls[0].args[2]).toBe(mockDraggable);

      expect(mockDroppable2.dragStart.calls.length).toBe(1);
      expect(mockDroppable2.dragStart.calls[0].args[0]).toBe(10);
      expect(mockDroppable2.dragStart.calls[0].args[1]).toBe(20);
      expect(mockDroppable2.dragStart.calls[0].args[2]).toBe(mockDraggable);
    });

    it('should set the currentDraggable to the current draggable model', function() {
      expect(dragdropManager.getCurrentDraggable()).toBe(mockDraggableModel);
    });

  });

  describe('calling "drag"', function() {

    beforeEach(function() {
      expect(mockDroppable1.drag).not.toHaveBeenCalled();
      expect(mockDroppable2.drag).not.toHaveBeenCalled();

      dragdropManager.drag(10, 20, mockDraggable);
    });

    it('should call "drag" on every registered droppable, passing the right parameters', function() {
      expect(mockDroppable1.drag.calls.length).toBe(1);
      expect(mockDroppable1.drag.calls[0].args[0]).toBe(10);
      expect(mockDroppable1.drag.calls[0].args[1]).toBe(20);
      expect(mockDroppable1.drag.calls[0].args[2]).toBe(mockDraggable);

      expect(mockDroppable2.drag.calls.length).toBe(1);
      expect(mockDroppable2.drag.calls[0].args[0]).toBe(10);
      expect(mockDroppable2.drag.calls[0].args[1]).toBe(20);
      expect(mockDroppable2.drag.calls[0].args[2]).toBe(mockDraggable);
    });

  });

  describe('calling "dragStop"', function() {

    beforeEach(function() {
      expect(mockDroppable1.dragStop).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStop).not.toHaveBeenCalled();

      dragdropManager.dragStop(10, 20, mockDraggable);
    });

    it('should call "dragStop" on every registered droppable, passing the right parameters', function() {
      expect(mockDroppable1.dragStop.calls.length).toBe(1);
      expect(mockDroppable1.dragStop.calls[0].args[0]).toBe(10);
      expect(mockDroppable1.dragStop.calls[0].args[1]).toBe(20);
      expect(mockDroppable1.dragStop.calls[0].args[2]).toBe(mockDraggable);

      expect(mockDroppable2.dragStop.calls.length).toBe(1);
      expect(mockDroppable2.dragStop.calls[0].args[0]).toBe(10);
      expect(mockDroppable2.dragStop.calls[0].args[1]).toBe(20);
      expect(mockDroppable2.dragStop.calls[0].args[2]).toBe(mockDraggable);
    });

  });

  describe('calling "dragStop" after a "dragStart"', function() {

    beforeEach(function() {
      dragdropManager.dragStart(10, 20, mockDraggable);

      expect(dragdropManager.getCurrentDraggable()).not.toBeUndefined();

      dragdropManager.dragStop(10, 20, mockDraggable);
    });

    it('should reset the currentDraggable to undefined', function() {
      expect(dragdropManager.getCurrentDraggable()).toBeUndefined();
    });

  });

  describe('calling "dragStop" when currentDroppable is set', function() {

    beforeEach(function() {
      dragdropManager._setCurrentDroppable(mockDroppable1);

      expect(dragdropManager.getCurrentDroppable()).not.toBeUndefined();

      dragdropManager.dragStop(10, 20, mockDraggable);
    });

    it('should reset the currentDroppable to undefined', function() {
      expect(dragdropManager.getCurrentDroppable()).toBeUndefined();
    });

  });

  describe('calling "unregisterDroppable"', function() {

    beforeEach(function() {
      dragdropManager.unregisterDroppable(mockDroppable1);
    });

    it('should not call "dragStart" on that droppable anymore', function() {
      expect(mockDroppable1.dragStart).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStart).not.toHaveBeenCalled();

      dragdropManager.dragStart(10, 20, mockDraggable);

      expect(mockDroppable1.dragStart).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStart.calls.length).toBe(1);
    });

    it('should not call "drag" on that droppable anymore', function() {
      expect(mockDroppable1.drag).not.toHaveBeenCalled();
      expect(mockDroppable2.drag).not.toHaveBeenCalled();

      dragdropManager.drag(10, 20, mockDraggable);

      expect(mockDroppable1.drag).not.toHaveBeenCalled();
      expect(mockDroppable2.drag.calls.length).toBe(1);
    });

    it('should not call "dragStop" on that droppable anymore', function() {
      expect(mockDroppable1.dragStop).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStop).not.toHaveBeenCalled();

      dragdropManager.dragStop(10, 20, mockDraggable);

      expect(mockDroppable1.dragStop).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStop.calls.length).toBe(1);
    });

  });

  describe('registering the same droppable two times', function() {

    beforeEach(function() {
      dragdropManager.registerDroppable(mockDroppable1);
    });

    it('should call "dragStart" only one time on that droppable', function() {
      expect(mockDroppable1.dragStart).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStart).not.toHaveBeenCalled();

      dragdropManager.dragStart(10, 20, mockDraggable);

      expect(mockDroppable1.dragStart.calls.length).toBe(1);
      expect(mockDroppable2.dragStart.calls.length).toBe(1);
    });

    it('should call "drag" only one time on that droppable', function() {
      expect(mockDroppable1.drag).not.toHaveBeenCalled();
      expect(mockDroppable2.drag).not.toHaveBeenCalled();

      dragdropManager.drag(10, 20, mockDraggable);

      expect(mockDroppable1.drag.calls.length).toBe(1);
      expect(mockDroppable2.drag.calls.length).toBe(1);
    });

    it('should call "dragStop" only one time on that droppable', function() {
      expect(mockDroppable1.dragStop).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStop).not.toHaveBeenCalled();

      dragdropManager.dragStop(10, 20, mockDraggable);

      expect(mockDroppable1.dragStop.calls.length).toBe(1);
      expect(mockDroppable2.dragStop.calls.length).toBe(1);
    });

  });

  describe('unregistering a droppable that is not registered', function() {

    beforeEach(function() {
      dragdropManager.unregisterDroppable(mockDroppable1);
      dragdropManager.unregisterDroppable(mockDroppable1);
    });

    it('should continue calling "dragStart" on the other droppables', function() {
      expect(mockDroppable1.dragStart).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStart).not.toHaveBeenCalled();

      dragdropManager.dragStart(10, 20, mockDraggable);

      expect(mockDroppable1.dragStart).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStart.calls.length).toBe(1);
    });

    it('should continue calling "drag" on the other droppables', function() {
      expect(mockDroppable1.drag).not.toHaveBeenCalled();
      expect(mockDroppable2.drag).not.toHaveBeenCalled();

      dragdropManager.drag(10, 20, mockDraggable);

      expect(mockDroppable1.drag).not.toHaveBeenCalled();
      expect(mockDroppable2.drag.calls.length).toBe(1);
    });

    it('should continue calling "dragStop" on the other droppables', function() {
      expect(mockDroppable1.dragStop).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStop).not.toHaveBeenCalled();

      dragdropManager.dragStop(10, 20, mockDraggable);

      expect(mockDroppable1.dragStop).not.toHaveBeenCalled();
      expect(mockDroppable2.dragStop.calls.length).toBe(1);
    });

  });

});
