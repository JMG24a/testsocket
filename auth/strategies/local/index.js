const { Strategy } = require('passport-local');
const { login } = require('../../../src/controllers/user-controller');

const local_auth = new Strategy(
  {usernameField:'email', passwordField: 'password'},
  async(username, password, done)=>{
    try{
      const user = await login(username,password)
      done(null,user)
    }catch(err){
      done(err,false)
    }
})

module.exports = local_auth
