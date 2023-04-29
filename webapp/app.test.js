const { add } = require('./public/api');

describe('Utility functions', () => {
  describe('add', () => {
    it('should return the sum of two numbers', () => {
      const result = add.add(1, 2);
      expect(result).toBe(3);
    });
  });
});
