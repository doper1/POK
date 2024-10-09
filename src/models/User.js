const userRepo = require('../repositories/userRepo.js');

class User {
  constructor(user) {
    this.id = user.id;
    this.money = user.money;
  }

  static async create(phoneNumber) {
    let user = await userRepo.createUser(phoneNumber);
    return new User(user);
  }

  static async get(phoneNumber) {
    let user = await userRepo.getUser(phoneNumber);

    if (user == undefined) return undefined;
    return new User(user);
  }

  async set(property, value) {
    this[property] = value;
    await userRepo.updateUser(this.id, property, value);
  }
}

module.exports = User;
