const users = [];

// Join user to chat
function join(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getuser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function left(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function userroom(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  join,
  getuser,
  left,
  userroom
};
