describe('dragdropPositioning', function() {

  var dragdropPositioning;

  beforeEach(function() {
    module('angular-drag-drop');

    inject(function(_dragdropPositioning_) {
      dragdropPositioning = _dragdropPositioning_;
    });
  });
  
  describe('isMouseOver', function() {
    
    var droppableEl,
    mockDroppable,
    elLeft, elTop;
    
    beforeEach(function() {
      droppableEl = $('<div></div>').css({
        display: "inline-block",
        height: 50,
        width: 50
      }).appendTo($(document.body));
  
      mockDroppable = {
        $element: droppableEl
      };
      
      elLeft = droppableEl.offset().left;
      elTop = droppableEl.offset().top;
    });
    
    it('should return true when the mouse is over the droppable element', function() {
      expect(dragdropPositioning.isMouseOver(elLeft + 20, elTop + 20, mockDroppable)).toBeTruthy();
      expect(dragdropPositioning.isMouseOver(elLeft + 10, elTop + 20, mockDroppable)).toBeTruthy();
      expect(dragdropPositioning.isMouseOver(elLeft + 30, elTop + 20, mockDroppable)).toBeTruthy();
      expect(dragdropPositioning.isMouseOver(elLeft + 20, elTop + 10, mockDroppable)).toBeTruthy();
      expect(dragdropPositioning.isMouseOver(elLeft + 20, elTop + 30, mockDroppable)).toBeTruthy();
    });
    
    it('should return false when the mouse is not over the droppable element', function() {
      expect(dragdropPositioning.isMouseOver(elLeft + 20, elTop + 60, mockDroppable)).toBeFalsy();
      expect(dragdropPositioning.isMouseOver(elLeft + 60, elTop + 20, mockDroppable)).toBeFalsy();
      expect(dragdropPositioning.isMouseOver(elLeft + 60, elTop + 60, mockDroppable)).toBeFalsy();
      expect(dragdropPositioning.isMouseOver(elLeft - 20, elTop + 20, mockDroppable)).toBeFalsy();
      expect(dragdropPositioning.isMouseOver(elLeft + 20, elTop - 20, mockDroppable)).toBeFalsy();
      expect(dragdropPositioning.isMouseOver(elLeft - 20, elTop - 20, mockDroppable)).toBeFalsy();
      expect(dragdropPositioning.isMouseOver(elLeft + 60, elTop - 20, mockDroppable)).toBeFalsy();
      expect(dragdropPositioning.isMouseOver(elLeft + 20, elTop + 60, mockDroppable)).toBeFalsy();
    });
    
  });
  
});
