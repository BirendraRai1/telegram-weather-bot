const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // FIXED IMPORT
const User = require("../models/user");
const Setting = require("../models/setting");

const { DB_PASSWORD, DB_USER, DB_NAME, ADMIN_PASSWORD } = process.env;
const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.dk5ax2e.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

// Connect ONCE before all tests
beforeAll(async () => {
  await mongoose.connect(dbURL);
});

// Clean up and disconnect AFTER all tests
afterAll(async () => {
   await User.deleteMany({});
   await Setting.deleteMany({});
  await mongoose.connection.close();
});

describe("Admin Panel", () => {
  let testUser;
  let testSetting;

  // Create fresh data for EACH test
  beforeEach(async () => {
    // Clear previous test data
    await User.deleteMany({});
    await Setting.deleteMany({});

    // Create new test user
    testUser = await User.create({
      chatId: 123456789,
      firstName: "Test",
      lastName: "User",
      isBlocked:false
    });

    // Create new test setting
    testSetting = await Setting.create({ 
      key: "TEST_KEY", 
      value: "test_value" 
    });
  });

  it("should get users", async () => {
    const res = await request(app).get(`/admin/users/${ADMIN_PASSWORD}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ firstName: "Test" })
      ])
    );
  });

  it("should block a  active user and unblock a blocked user", async () => {
    const res = await request(app).post(
      `/admin/users/${ADMIN_PASSWORD}/${testUser._id}/blockUnblock`)
      .send({blocked:true});

    expect(res.statusCode).toEqual(200);
    const updatedUser = await User.findById(testUser._id);
    expect(updatedUser.isBlocked).toBe(true);
  });

  it("should update setting", async () => {
    const res = await request(app)
      .put(`/admin/settings/${ADMIN_PASSWORD}`)
      .send({ apiKey:"TEST_KEY",key: "TEST_KEY", value: "updated_value" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.value).toEqual("updated_value");

    const setting = await Setting.findOne({ key: "TEST_KEY" });
    expect(setting.value).toEqual("updated_value");
  });
});