const moment = require('moment');
const { getuser } = require('./user');

function formatmsg(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}
function location(username, lat ,lng){
  return{
    username,
    url:'https://www.google.com/maps?q=${lat},${lng}',
    time: moment().format('h:mm a')
  }
}
module.exports = {formatmsg,location};
