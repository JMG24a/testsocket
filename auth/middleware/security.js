const bcrypt = require('bcrypt');

const security = async(password) =>{
  const encryption = await bcrypt.hash(password,10)
  return encryption
}

const security_confirm = async(password,db_password) =>{
  const encryption = await bcrypt.compare(password,db_password)
  return encryption
}



module.exports = {security, security_confirm}
