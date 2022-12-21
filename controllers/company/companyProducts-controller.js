const CompanyProductsModel = require("../../models/company/companyProducts.js");
const CompanyModel = require("../../models/company/company");
const UserModel = require("../../models/User");
const boom = require("@hapi/boom");
const { getDateInString } = require("../../helper/getDateInString.js");


const getSearchProducts = async (value, token, options) => {
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies);
    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }

    const regex = new RegExp(value.replace("_", " "));

    const products = await CompanyProductsModel
      .find({ $and: [{name: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanyProductsModel
      .find({ $and: [{name: {$regex: regex, $options: 'gi'}},{idCompany: user.companies}]})
      .count()

    return {products, count}
  } catch (error) {
    console.log(error.message)
  }
};


const getCompanyProducts = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const products = await CompanyProductsModel
    .find({idCompany: idCompany})
    .limit(options.limit)
    .skip(options.offset);

    const count = await CompanyProductsModel
      .find({idCompany: idCompany})
      .count()

  return {products, count}
};

const postCompanyProduct = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    body.idCompany = idCompany
    const newProducts = new CompanyProductsModel(body);
    const saveObject = await newProducts.save();

    return saveObject
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const importCompanyProducts = async (body, token) => {
  try {
    let result = "Error no encontrado"
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      throw boom.notFound("Usuario no encontrado")
    }

    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id) && !company.userId.includes(token.sub.id)){
        throw boom.conflict("este usuario no es un empleado")
      }
    }else{
      throw boom.notFound("Esta empresa no esta registrada")
    }

    let validatorImport = {}
    const products = []
    const queryProducts = []

    body.map((product) => {
      //fecha de import
      const date = new Date()
      //products
      if(validatorImport[product.code] === undefined){
        queryProducts.push(product.code)
        validatorImport[product.code] = {
          idCompany: user.companies,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          quantity: product.quantity,
          wareHouse: product.wareHouse,
          code: product.code,
          dateImport: getDateInString(date)
        }
      }
    })

    const dbProducts = await CompanyProductsModel.find({
      $and: [
        {idCompany: user.companies},
        {customerId: queryProducts}
      ]
    });
    
    dbProducts.map((db) => {
      if(db.code == validatorImport[db.code].code){
        delete(validatorImport[db.code])
      }
    })

    Object.keys(validatorImport).map(item => {
      products.push(validatorImport[item])
    })

    const options = { ordered: false };
    await CompanyProductsModel.insertMany(products, options);
    // await uploadedSale(token.sub.email)
    
    return result
  }catch(e){
    console.log(e)
    throw boom.conflict('El import no pudo ser procesado')
  }
};

const putCompanyProduct = async (id, body, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  if(!company.employeesId.includes(token.sub.id) ){
    if(!company.userId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
  }

  const editCompanyProducts = await CompanyProductsModel.findByIdAndUpdate(id, body, { new: true });
  return editCompanyProducts
};

const deleteCompanyProduct = async (id, token, idCompany) => {
  const company = await CompanyModel.findById(idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanyProductsModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

const deleteImportCompanyProducts = async (body) => {
  try{
    const user = await UserModel.findById(body.id)
    if(!user){
      throw boom.notFound("este usuario no fue encontrado")
    }
    body.idCompany = user.id
  
    const company = await CompanyModel.findById(user.companies)
    if(company !== null){
      if(!company.employeesId.includes(body.id) || !company.userId.includes(body.id)){
        throw boom.conflict("este usuario no es un empleado")
      }
      body.idCompany = company.id
    }else{
      throw boom.notFound("Esta empresa no esta registrada")
    }
  
    const delCompanyProducts = await CompanyProductsModel.deleteMany({
      $and: [
        {idCompany: body.idCompany},
        {"dateImport": {$eq : body.start}}
      ]
    });
  
    if(delCompanyProducts.deletedCount === 0){
      throw boom.notFound("Sin registros de importaciones")
    }
  
    return delCompanyProducts.acknowledged ? true : false;
  }catch(e){
    throw boom.badRequest("Sin registros de importaciones")
  }

};

module.exports = {
  getSearchProducts,
  getCompanyProducts,
  postCompanyProduct,
  importCompanyProducts,
  putCompanyProduct,
  deleteCompanyProduct,
  deleteImportCompanyProducts
}
