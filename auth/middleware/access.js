const UserModel = require('../../models/User')
const CompanyModel = require('../../models/company/company')
const boom = require('@hapi/boom')

const accessToCompany = async(req, res, next) => {
  const token = req.myPayload;
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    res.json({
      ok: false,
      response: [],
      error: {
        "statusCode": 404,
        "error": "Not fount",
        "message": "No se encontro este usuario"
      }
    })
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(!company.employeesId.includes(token.sub.id)){
      res.json({
        ok: false,
        response: 'None authorization',
        error: {
          "statusCode": 401,
          "error": "None authorization",
          "message": "No tienes permisos"
        }
      })
    }
  }else{
    res.json({
      ok: false,
      response: [],
      error: {
        "statusCode": 404,
        "error": "Not fount",
        "message": "No se encontro esta empresa"
      }
    })
  }

  req.accessToCompany = {user: user, company: company}
  next()
}

const accessToKey = () => {

}

module.exports = {
    accessToCompany
}
