function boomError(error, res, req, next){
    if(error.isBoom){
        const { output } = error;
        res.status(output.statusCode).json(output.payload)
    }
    next(error)
}

module.exports = {
    boomError
}