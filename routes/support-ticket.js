const { Router } = require('express');
const router = Router();
const SupportTicket = require('../models/SupportTicket');
const userModel = require('../models/User');
const Passport = require('passport');
const { validateToken } = require('../auth/middleware/jwt');

const getSupportTickets = async (req, res) => {
  const supportTickets = await SupportTicket.find().populate('userId');

  res.status(200).json({
    ok: true,
    msg: 'Listado de Tickets',
    supportTickets,
  });
};

const getSupportTicket = async (req, res) => {
  const { id } = req.params;
  const supportTicket = await SupportTicket.findById(id).populate('userId');

  res.status(200).json({
    ok: true,
    msg: 'Ticket',
    supportTicket,
  });
};

const getSupportTicketsByUser = async (req, res) => {
  const token = req.myPayload;
  const supportTickets = await SupportTicket.find({userId: token.sub.id});

  res.status(200).json({
    ok: true,
    msg: 'Listado de Tickets',
    supportTickets,
  });
};

const postSupportTicket = async (req, res) => {
  const body = req.body;
  const token = req.myPayload;
  body.userId = token.sub.id

  try {
    const user = new SupportTicket(body);
    const newUser = await user.save();

    res.status(201).json({
      ok: true,
      msg: 'Creado',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error en la peticion',
      error,
    });
  }
};

const putSupportUser = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    await userModel.findByIdAndUpdate(id, body, {
      new: true,
    })

    res.status(201).json({
      ok: true,
      msg: 'Update',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error en la peticion',
      error,
    });
  }
}

const putSupportTicket = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    await SupportTicket.findByIdAndUpdate(id, body)

    res.status(201).json({
      ok: true,
      msg: 'Update',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error en la peticion',
      error,
    });
  }
}

const deleteSupportTicket = async (req, res) => {
  const { id } = req.params;

  try {
    await SupportTicket.findByIdAndDelete(id)

    res.status(201).json({
      ok: true,
      msg: 'delete',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error en la peticion',
      error,
    });
  }
}

router.post(
  '/',
  Passport.authenticate('jwt', { session: false }),
  validateToken,
  postSupportTicket
);
router.put(
  '/editUser/:id',
  Passport.authenticate('jwt', { session: false }),
  validateToken,
  putSupportUser
);
router.put('/editTicket/:id',putSupportTicket);

router.get('/', getSupportTickets);

router.get(
  '/user',
  Passport.authenticate('jwt', { session: false }),
  validateToken,
  getSupportTicketsByUser
);
router.get('/:id', getSupportTicket);

router.delete('/:id', deleteSupportTicket);

module.exports = router;
