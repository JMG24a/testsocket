const ContactModel = require("../models/contacts");
const UserModel = require("../models/User");
const CompanyModel = require("../models/company");
const userController = require("./user-controller");

const getSearchContacts = async (value, token, options) => {
  try {
    const user = await UserModel.findById(token.sub.id)
    if(!user){
      return "este no es un usuario"
    }
    const company = await CompanyModel.findById(user.companies);
    if(company !== null){
      if(!company.employeesId.includes(token.sub.id)){
        return "este usuario no es un empleado"
      }
    }

    const regex = new RegExp(value.replace("_", " "));

    const Contacts = await ContactModel
      .find({
        $and: [
          {name: {$regex: regex, $options: 'gi'}},
          {$or: [{companyId: user.companies},{userId: token.sub.id}]}
        ]})
      .limit(options.limit)
      .skip(options.offset);

    return Contacts
  } catch (error) {
    console.log(error)
  }
};

const getContacts = async (token, options) => {
  const user = await UserModel.findById(token.sub.id)
  if(!user){
    return "este no es un usuario"
  }
  const company = await CompanyModel.findById(user.companies)
  if(company !== null){
    if(company.employeesId.includes(token.sub.id) === false){
      return "este usuario no es un empleado"
    }
  }

  const Contact = await ContactModel
  .find({$or: [{companyId: user.companies}, {userId: token.sub.id}]})
  .limit(options.limit)
  .skip(options.offset);

  console.log('%cMyProject%cline:48%cContact', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px', Contact)
  return Contact
};

const getContactsUser = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }

  const user = await userController.getUser(id)

  const ContactByUser = await ContactModel.find({userId: id});
  const ContactByCompany = await ContactModel.find({companyId: user.companies[0]._id});

  const Contact = [
    ...ContactByUser,
    ...ContactByCompany
  ]

  return Contact
};

const getContactsCompany = async (id) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }

  const user = await userController.getUser(id)
  const ContactByCompany = await ContactModel.find({companyId: user.companies[0]._id});

  const Contact = [
    ...ContactByCompany
  ]

  return Contact
};


const getContact = async (id, idContact) => {
  if(!id){
    return 'La propiedad no fue encontrada'
  }
  const Contact = await ContactModel.find({userId: id, id: idContact});
  return Contact
};

const postContact = async (body, token) => {
  try {
    let ContactsOwner
    const user = await userController.getUser(token.sub.id)
    if(user.companies[0]._id){
      body.companyId = user.companies[0]._id;
      const Contact = new ContactModel(body);
      const saveObject = await Contact.save();

      ContactsOwner = await getContactsCompany(token.sub.id)
    }else{
      body.userId = token.sub.id;
      const Contact = new ContactModel(body);
      const saveObject = await Contact.save();

      user.contacts.push(saveObject.id)

      await userController.putUser(token, {contacts: user.contacts})

      ContactsOwner = await getContact(token.sub.id)
    }

    return ContactsOwner
  }catch(e){
    throw new Error ('El usuario no pudo ser creado')
  }
};

const putContact= async (id, body) => {
  const Contact = await getContact(id);

  if (typeof Contact === 'string') {
    return Contact
  }

  const newContact = await ContactModel.findByIdAndUpdate(id, body, { new: true });
  return newContact
};

const deleteContact = async (id, token) => {
  let user = await userController.getUser(token.sub.id)
  let deleteContact

  if(user.contacts.includes(id)){
    user.contacts = user.contacts.filter(_id => _id === id)
    await userController.putUser(token, {contacts: user.contacts})
    deleteContact = await ContactModel.findByIdAndDelete(id);
  }else{
    deleteContact = await ContactModel.findByIdAndDelete(id);
  }

  return deleteContact;
};

module.exports = {
  getSearchContacts,
  getContacts,
  getContactsUser,
  getContactsCompany,
  getContact,
  postContact,
  putContact,
  deleteContact
}
