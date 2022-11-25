const { Router } = require('express')
const ContactsController = require('../controllers/contacts-controller')
//middleware
const { validateToken } = require('../auth/middleware/jwt');

const router = Router();

const getSearchContacts = async (req, res) => {
  const {value} = req.params;
  const options = req.query;
  const token = req.myPayload;

  try{
    const contacts = await ContactsController.getSearchContacts(value, token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Contactos",
      contacts,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getContacts = async (req, res) => {
  const options = req.query;
  const token = req.myPayload;
  try{
    const contact = await ContactsController.getContacts(token, options)

    res.status(200).json({
      ok: true,
      msg: "Listado de Accountos",
      contact,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getContactById = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload;
  try{
    const contact = await ContactsController.getContactById(token, id)

    res.status(200).json({
      ok: true,
      msg: "Listado de Accountos",
      contact,
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getContactsUser = async (req, res) => {
  const token = req.myPayload
  try{
    const contact = await ContactsController.getContactsUser(token.sub.id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      contact
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getContactsCompany = async (req, res) => {
  const token = req.myPayload
  try{
    const contact = await ContactsController.getContactsCompany(token.sub.id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      contact
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getContact = async (req, res) => {
  const token = req.myPayload
  const { idContact } = req.params
  try{
    const contact = await ContactsController.getContact(token.sub.id, idContact)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      contact
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postContact = async (req, res) => {
  const token = req.myPayload
  const body = req.body;
  try {
    const newContact = await ContactsController.postContact(body, token);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      contact: newContact
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putContact = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newContact = await ContactsController.putContact(id, body)

    if (typeof newContact === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      newContact,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteContact = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await ContactsController.deleteContact(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    ok: isDelete
  });
};
router.get("/", validateToken, getContacts);
router.get("/search/:value", validateToken, getSearchContacts);
router.get("/:id", validateToken, getContactById);
router.post("/", validateToken, postContact);
router.put("/:id", putContact);
router.delete("/:id", validateToken, deleteContact);

module.exports = router
