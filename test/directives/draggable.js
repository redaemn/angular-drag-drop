describe('draggable', function() {

  var $rootScope,
    $scope,
    $compile,
    elem,
    $body = $('body');

  beforeEach(function() {
    module('angular-drag-drop');

    inject(function(_$rootScope_, _$compile_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $scope = $rootScope.$new();
    });
  });

  describe('default behaviour', function() {

    var draggableHtml = "<div draggable></div>",
      elemHeight = 50,
      elemWidth = 50,
      elemTop,
      elemLeft;

    beforeEach(function() {
      elem = $compile(angular.element(draggableHtml))($scope);

      elem = $(elem).css({
        display: "inline-block",
        height: elemHeight,
        width: elemWidth
      }).appendTo($body);

      elemTop = elem.offset().top;
      elemLeft = elem.offset().left;

      $rootScope.$digest();
    });

    afterEach(function() {
      elem.remove();
    });

    describe('initial css style', function() {

      it('should set "z-index" to "10000"', function() {
        expect(elem.css('z-index')).toBe('10000');
      });

      it('should set "position" to "relative"', function() {
        expect(elem.css('position')).toBe('relative');
      });

      it('should set "top" to "0px"', function() {
        expect(elem.css('top')).toBe('0px');
      });

      it('should set "left" to "0px"', function() {
        expect(elem.css('top')).toBe('0px');
      });

    });

    describe('mousedown event', function() {

      describe('inside the draggable', function() {

        beforeEach(function() {
          elem.simulate('mousedown', {
            clientX: elemLeft + elemWidth / 2,
            clientY: elemTop + elemHeight / 2
          });
        });

        it('should set "z-index" to "10001"', function() {
          expect(elem.css('z-index')).toBe('10001');
        });

      });

      describe('outside the draggable', function() {

        beforeEach(function() {
          $body.simulate('mousedown', {
            clientX: elemLeft + elemWidth + 10,
            clientY: elemTop + elemHeight / 2
          });
        });

        it('should leave "z-index" to "10000"', function() {
          expect(elem.css('z-index')).toBe('10000');
        });

      });

    });

  });

});
