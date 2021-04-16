const { assert } = require('chai');

const { emailChecker } = require('../index.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('emailChecker', function() {
  it('should return true if email is in user object', function() {
    const value = emailChecker(testUsers, "user@example.com");
    const expectedOutput = true;
    assert.equal(value, expectedOutput);
    //done();

  });
  it('should return false if email is not in user object', function() {
    const value = emailChecker(testUsers, "apple@example.com");
    const expectedOutput = false;
    assert.equal(value, expectedOutput);
  });
});
