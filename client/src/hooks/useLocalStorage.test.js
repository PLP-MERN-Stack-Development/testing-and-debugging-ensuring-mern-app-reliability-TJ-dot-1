import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  const mockSetItem = jest.fn();
  const mockGetItem = jest.fn();
  
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(mockSetItem);
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(mockGetItem);
    jest.clearAllMocks();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    
    expect(result.current[0]).toBe('default');
  });

  it('should update value and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(result.current[0]).toBe('new value');
    expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify('new value'));
  });
});