const { Router } = require('express')
const articleController = require('../controllers/articleController.js');
//middleware
const { validateToken } = require('../auth/middleware/jwt');
const uploadFiles = require('../middleware/multer')

const router = Router();

const getArticles = async (req, res) => {
  const articles = await articleController.getArticles()

  res.status(200).json({
    ok: true,
    msg: "Listado de Articulos",
    articles,
  });
};

const getArticle = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  try{
    const article = await articleController.getArticle(id)

    res.status(200).json({
      ok: true,
      msg: "Propiedad",
      article
    });
  }catch(e){
    res.status(400).json({
      ok: false,
      msg: "Intenta mas tarde",
    });
  }
};

const postArticle = async (req, res) => {
  const body = req.body;
  try {
    const newArticle = await articleController.postArticle(body);
    res.status(201).json({
      ok: true,
      msg: "Creado",
      article: newArticle
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putArticleImage = async (req, res) => {
  const {id} = req.params;
  const { file } = req;

  try {
    const updateArticle = await articleController.putArticleImage(id, file);

    if (typeof updateArticle === 'string') {
      res.status(404).json({
        ok: false,
        msg: 'No Encontrado',
      });
    }

    res.status(200).json({
      ok: true,
      msg: 'Actualizado Correctamente',
      success: updateArticle,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: 'Error en la peticion',
      error,
    });
  }
};

const putArticle = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const newArticle = await articleController.putArticle(id, body)

    if (typeof newArticle === 'string') {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      newArticle,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteArticle = async (req, res) => {
  const {id} = req.params;
  const token = req.myPayload
  const isDelete = await articleController.deleteArticle(id, token)

  res.status(200).json({
    msg: "Eliminado con exito",
    success: isDelete
  });
};

router.get("/", getArticles);
router.get("/:id", validateToken, getArticle);
router.post("/", validateToken, postArticle);
router.put("/:id", putArticle);
router.put("/cover/:id", uploadFiles(), putArticleImage);
router.delete("/:id", validateToken, deleteArticle);

module.exports = router

