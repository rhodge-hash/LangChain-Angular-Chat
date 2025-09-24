const users = []; // In-memory store for prototype

export class User {
  constructor(email, password, roles = ['user']) {
    this.id = users.length + 1; // Simple ID generation
    this.email = email;
    this.password = password; // Hashed password
    this.roles = roles;
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static create(email, password, roles) {
    const newUser = new User(email, password, roles);
    users.push(newUser);
    return newUser;
  }

  static clearAll() {
    users.length = 0; // Clear all users for testing or reset
  }
}