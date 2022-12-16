const CompanyOrdersModel = require("../../models/companyOrders");
const CompanyAccountsModel = require("../../models/companyAccounts");
const CompanyModel = require("../../models/company");
const UserModel = require("../../models/User");

const getSearchOrders = async (value, token, options) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }
  try {
    const er = new RegExp(value.replace("_", " ")); //query

    const orders = await CompanyOrdersModel
      .find({
        $and: [
          {
            $or: [
              {"accountName": {$regex: er, $options: 'gi'}},
              {"accountPhone": {$regex: er, $options: 'gi'}},
            ]
          },
            {idCompany: user.companies}
        ]
      })
      .populate('contact')
      .limit(options.limit)
      .skip(options.offset);

    const count = await CompanyOrdersModel
      .find({
        $and: [
          {
            $or: [
              {"accountName": {$regex: er, $options: 'gi'}},
              {"accountPhone": {$regex: er, $options: 'gi'}},
            ]
          },
            {idCompany: user.companies}
        ]
      })
      .count()

    return {
      orders,
      count
    }
  } catch (error) {
    console.log(error)
  }
};

const getCompanyOrders = async (idCompany, token, options) => {
  const company = await CompanyModel.findById(idCompany)

  if(company.employeesId.includes(token.sub.id) === false){
    return "este usuario no es un empleado"
  }

  const orders = await CompanyOrdersModel
    .find({idCompany: idCompany})
    .populate('contact')
    .limit(options.limit)
    .skip(options.offset)
    .sort({createdAt:'descending'});

  const count = await CompanyOrdersModel
    .find({idCompany: idCompany})
    .count()

  return {orders, count}
};

const postCompanyOrder = async (body, token, idCompany) => {
  try {
    const company = await CompanyModel.findById(idCompany)

    if(!company.employeesId.includes(token.sub.id)){
      return "este usuario no es un empleado"
    }
    const contact = await CompanyAccountsModel.findById(body.contact)
    if(contact){
      body.accountName = contact.accountName
      body.accountPhone = contact.phone
    }
    body.idCompany = idCompany;
    body.orderWorkNumber = (parseInt(company.settings.orderWorksNumber, 10) + 1);

    const companyOrder = new CompanyOrdersModel(body);
    const saveObject = (await companyOrder.save()).populate('contact');

    new Promise(async(resolve, reject)=>{
      await CompanyModel.findByIdAndUpdate(idCompany,
        {
          settings: {
            ...company.settings,
            orderWorksNumber:( parseInt(company.settings.orderWorksNumber, 10) + 1)}
        },
        { new: true })
    })

    return saveObject
  }catch(e){
    console.log(e)
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putCompanyOrder= async (id, body, token) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  if(body.contact){
    const contact = await CompanyAccountsModel.findById(body.contact)
    if(contact){
      body.accountName = contact.accountName
      body.accountPhone = contact.phone
    }
  }

  const editOrder = await CompanyOrdersModel.findByIdAndUpdate(id, body, { new: true }).populate('contact');
  return editOrder
};

const deleteCompanyOrder = async (id, token, idCompany) => {
  const company = await CompanyModel.findById(idCompany);
  if(!company.employeesId.includes(token.sub.id)){
    return "este usuario no es un empleado"
  }

  const delCompanyOrder = await CompanyOrdersModel.findByIdAndDelete(id);
  return delCompanyOrder ? true : false;
};

module.exports = {
  getSearchOrders,
  getCompanyOrders,
  postCompanyOrder,
  putCompanyOrder,
  deleteCompanyOrder
}
