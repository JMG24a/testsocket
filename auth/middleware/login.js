const isLoggedIn = (req,res,next) => {
  console.log('I need this',req.user)
  req.user ? next() : res.sendStatus(401)
}

module.exports = { isLoggedIn }
