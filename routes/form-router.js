const { Router } = require('express')
const { getAllForms, getFormById } = require('../controllers/form-controller')

const router = Router();

router.get('/', getAllForms);
router.get('/:formId', getFormById);

module.exports = router;
// router.post("/", postForm);
// router.put("/:id", putForm);
// router.delete("/:id", deleteForm);

// const getForm = async (req, res) => {
//   const {id} = req.params;
//   const form = await formController.getForm(id)

//   res.status(200).json({
//     msg: "formulario",
//     form
//   });
// };

// const postForm = async (req, res) => {
//   const body = req.body;
//   try {
//     const newForm = await formController.postForm(body);
//     res.status(201).json({
//       ok: true,
//       msg: "Creado",
//       form: newForm
//     });
//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       msg: "Error en la peticion",
//       error,
//     });
//   }
// };

// const putForm = async (req, res) => {
//   const { id } = req.params;
//   const body = req.body;

//   try {
//     const newForm = await formController.putForm(id, body)

//     if (typeof newForm === 'string') {
//       res.status(404).json({
//         ok: false,
//         msg: "No Encontrado",
//       });
//     }

//     res.status(200).json({
//       ok: true,
//       msg: "Actualizado Correctamente",
//       newForm,
//     });
//   } catch (error) {
//     res.status(501).json({
//       ok: false,
//       msg: "Error en la peticion",
//       error,
//     });
//   }
// };

// const deleteForm = async (req, res) => {
//   const {id} = req.params;
//   const isDelete = await formController.deleteForm(id)

//   res.status(200).json({
//     msg: "Eliminado con exito",
//     success: isDelete
//   });
// };