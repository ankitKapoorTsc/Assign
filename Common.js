const fs = require('fs');

exports.readUsers = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

exports.readUserById = (filePath, id) => {
  const users = exports.readUsers(filePath);
  return users.find(u => u.id === Number(id)) || {};
};

exports.writeUsers = (filePath, users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};