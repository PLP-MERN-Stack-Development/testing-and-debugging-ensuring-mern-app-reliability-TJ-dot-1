import { formatDate, validateEmail, debounce } from './helpers';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-01');
      expect(formatDate(date)).toBe('January 1, 2023');
    });

    it('should handle invalid date', () => {
      expect(formatDate('invalid')).toBe('Invalid Date');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();
    
    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});