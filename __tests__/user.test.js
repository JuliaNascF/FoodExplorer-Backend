const UsersController = require('../src/controllers/UsersController');
const UserRepository = require('../src/repositories/UsersRepository');
const UserCreateService = require('../src/services/UserCreationService');
const AppError = require('../src/utils/AppError');

describe('Users Controller', () => {
  it('should create a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
    };
    
    const usersController = new UsersController();
    const mockExecute = jest.spyOn(UserCreateService.prototype, 'execute');
    mockExecute.mockResolvedValueOnce({
      id: 1,
      ...newUser,
    });
    const request = { body: newUser };
    const response = { status: jest.fn(), json: jest.fn() };
    response.status.mockReturnValue(response);

    await usersController.create(request, response);

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith();
  });
});
