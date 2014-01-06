describe("angular-drag-drop", function() {
  
  it('should create a global "dragdropModule" variable containing the "angular-drag-drop" module', function() {
    expect(dragdropModule).not.toBe(undefined);
    expect(dragdropModule.name).toBe("angular-drag-drop");
    expect(dragdropModule.requires).toEqual(['ui.bootstrap.position']);
  });
  
});
