const jwt = require('jsonwebtoken');
const { authenticate } = require('./auth');
const User = require('../models/User');

jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      header: jest.fn()
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should return 401 if no token provided', async () => {
    mockReq.header.mockReturnValue(null);

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'No token provided'
    });
  });

  it('should call next if token is valid', async () => {
    const mockUser = { id: 'mock-user-id', email: 'mock@example.com' };
    const mockToken = 'valid-token';

    mockReq.header.mockReturnValue(`Bearer ${mockToken}`);

    await authenticate(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });
});