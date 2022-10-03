const { Router } = require('express');
const router = Router();
const requestsModel = require('../models/request.js');
const passport = require('passport');
const { validateToken } = require('../auth/middleware/jwt');

const getRequests = async (req, res) => {
  const requestsList = await requestsModel.find().populate('idUser');

  res.status(200).json({
    msg: 'Listado de requests',
    requestsList,
  });
};

const postRequests = async (req, res) => {
  const body = req.body;
  const token = req.myPayload;
  const newRequest = {
    title: body.title,
    description: body.description,
    idUser: token.sub.id
  }

  try {
    const requestsList = new requestsModel(newRequest);
    const saveRequest = await requestsList.save();

    res.status(201).json({
      ok: true,
      msg: 'Agregado en requests List',
      response: saveRequest
    });
  } catch {
    console.log('error');
  }
};

const putRequests = async (req, res) => {
  const {id} = req.params;
  const body = req.body;
  try {
    const updateRequests = await requestsModel.findByIdAndUpdate(id, body, { new: true })

    res.status(201).json({
      ok: true,
      msg: 'requests Actializado',
      result: updateRequests
    });
  } catch {
    console.log('error');
  }
};

const delRequests = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteRequests = await requestsModel.findByIdAndDelete(id)

    res.status(201).json({
      ok: true,
      msg: 'requests Eliminado',
      result: deleteRequests
    });
  } catch {
    console.log('error');
  }
};

router.get('/', getRequests);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validateToken,
  postRequests
);
router.put('/:id', putRequests);
router.delete('/:id', delRequests);

module.exports = router;
