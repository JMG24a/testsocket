const { Router } = require('express')
const CompanyController = require('../controllers/company-controller')
//middleware
const { validateToken } = require('../auth/middleware/jwt');
const { validatorRoles } = require('../auth/middleware/roles');

const router = Router();

const getCompanies = async (req, res) => {
  const company = await companiesController.getCompanies()

  res.status(200).json({
    ok: true,
    msg: "Listado de relaciones",
    company,
  });
};

const getCompaniesBySearch = async (req, res) => {
  //retorna informacion limitada de la las empresas
  //deshabilitado por el momento
  const company = await companiesController.getCompanies()

  res.status(200).json({
    ok: true,
    msg: "Listado de relaciones",
    company,
  });
};

const getCompaniesUser = async (req, res) => {
  const token = req.myPayload
  try{
    const company = await CompanyController.getCompaniesUser(token.sub.id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      company
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const getCompanyByEmployee = async (req, res) => {
  const token = req.myPayload

  try{
    const company = await CompanyController.getCompanyByEmployee(token.sub.id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      company
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postCompany = async (req, res) => {
  const token = req.myPayload
  const body = req.body;
  try {
    const newCompany = await CompanyController.postCompany(body, token);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      company: newCompany
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putCompany = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newCompany = await CompanyController.putCompany(id, body)

    if (typeof newCompany === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      company: newCompany,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteCompany = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await CompanyController.deleteCompany(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};


//acciones del empleado
const addEmployeeCompany = async (req, res) => {
  const token = req.myPayload;
  const {userId} = req.body;

  try{
    const addUser = await CompanyController.addEmployeeCompany(token, userId)

    res.status(200).json({
      ok: true,
      msg: "company",
      employees: addUser
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const addEmployeeCompanyById = async(req, res) => {
  const token = req.myPayload;
  const {idCompany} = req.body;

  try{
    const addUser = await CompanyController.addEmployeeCompanyById(token, idCompany)

    res.status(200).json({
      ok: true,
      msg: "company",
      employees: addUser
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const disabledEmployeeCompany = async (req, res) => {
  const token = req.myPayload;
  const {id} = req.params;

  try{
    const disabledUser = await CompanyController.disabledEmployeeCompany(token, id)

    res.status(200).json({
      ok: true,
      msg: "company",
      employees: disabledUser
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const delEmployeeCompany = async (req, res) => {
  const token = req.myPayload;
  const {id} = req.params;

  try{
    const disabledUser = await CompanyController.delEmployeeCompany(token, id)

    res.status(200).json({
      ok: true,
      msg: "company",
      employees: disabledUser
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const getEmployeeTakesCompanyInfo = async (req, res) => {
  const {idCompany} = req.params;
  const token = req.myPayload;

  try{
    const companyContacts = await CompanyController.getEmployeeTakesCompanyInfo(token, idCompany)

    res.status(200).json({
      ok: true,
      msg: "contacts",
      company: companyContacts
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const createEmployeeTakesCompanyInfo = async (req, res) => {
  const {idCompany} = req.params;
  const body = req.body
  const token = req.myPayload;
  try{
    const companyContacts = await CompanyController.createEmployeeTakesCompanyInfo(token, idCompany, body)

    res.status(200).json({
      ok: true,
      msg: "contacts",
      company: companyContacts
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const editEmployeeTakesCompanyInfo = async (req, res) => {
  const {idCompany} = req.params;
  const body = req.body
  const token = req.myPayload;
  try{
    const companyContacts = await CompanyController.editEmployeeTakesCompanyInfo(token, idCompany, body)

    res.status(200).json({
      ok: true,
      msg: "contacts",
      company: companyContacts
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

const deleteEmployeeTakesCompanyInfo = async (req, res) => {
  const {idCompany} = req.params;
  const body = req.body
  const token = req.myPayload;
  try{
    const companyContacts = await CompanyController.deleteEmployeeTakesCompanyInfo(token, idCompany, body)

    res.status(200).json({
      ok: true,
      msg: "contacts",
      company: companyContacts
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
}

router.get(
  "/",
  validatorRoles(['employee']),
  getCompanies
);

router.get("/user", validateToken, getCompaniesUser);
router.get("/employee", validateToken, getCompanyByEmployee);
router.post("/", validateToken, postCompany);
router.put("/:id", putCompany);
router.delete("/:id", validateToken, deleteCompany);
//employee
// router.put("/employee/add", validateToken, addEmployeeCompany);
router.put("/employee/addById", validateToken, addEmployeeCompanyById);
router.put("/employee/disable/:id", validateToken, disabledEmployeeCompany);
router.put("/employee/del/:id", validateToken, delEmployeeCompany);
router.get("/employee/:idCompany", validateToken, getEmployeeTakesCompanyInfo);
router.put("/employee/post/:idCompany", validateToken, createEmployeeTakesCompanyInfo);
router.put("/employee/put/:idCompany", validateToken, editEmployeeTakesCompanyInfo);
router.put("/employee/del/:idCompany", validateToken, deleteEmployeeTakesCompanyInfo);

module.exports = router
