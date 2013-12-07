describe("angular-drag-drop", function() {
  
  it("should create hello", function() {
    expect(typeof window.hello).toBe('string');
    expect(window.hello).toBe("world");
  });
  
  it("should not create byebye", function() {
    expect(window.byebye).toBe(undefined);
  });
  
});