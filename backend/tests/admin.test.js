const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Setting = require('../models/Setting');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

describe('Admin Panel', () => {
  let testUser;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      chatId: 123456789,
      firstName: 'Test',
      lastName: 'User'
    });
    
    // Create test setting
    await Setting.create({ key: 'TEST_KEY', value: 'test_value' });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Setting.deleteMany({});
  });

  it('should get users', async () => {
    const res = await request(app)
      .get(`/admin/users?password=${ADMIN_PASSWORD}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ firstName: 'Test' })
      ])
    );
  });

  it('should block a user', async () => {
    const res = await request(app)
      .post(`/admin/users/${testUser._id}/block?password=${ADMIN_PASSWORD}`);
    
    expect(res.statusCode).toEqual(200);
    
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser.isBlocked).toBe(true);
  });

  it('should update setting', async () => {
    const res = await request(app)
      .put('/admin/settings')
      .query({ password: ADMIN_PASSWORD })
      .send({ key: 'TEST_KEY', value: 'updated_value' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.value).toEqual('updated_value');
    
    const setting = await Setting.findOne({ key: 'TEST_KEY' });
    expect(setting.value).toEqual('updated_value');
  });
});