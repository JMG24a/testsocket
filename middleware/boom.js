function boomError(error, req, res, next){
  if(error.isBoom){
    const { output } = error;
    res.status(output.statusCode).json({ok: false, error: output.payload})
  }
  next(error)
}

module.exports = {
  boomError
}
