const validatorRoles = (roles) =>{
  return (req, res, next) =>{
    const user = req.user
    if(roles.includes(user.role)){
      next()
    }else{
      res.status(401).json({
        ok: false,
        msg: "No tienes permisos para esta accion",
        error,
      });
    }
  }
}

module.exports = { validatorRoles }
