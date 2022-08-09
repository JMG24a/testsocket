const { Router } = require('express');
const router = Router();
const SupportTicket = require('../models/SupportTicket');

const getSupportTickets = async (req, res) => {
  const supportTickets = await SupportTicket.find().populate('userId');

  res.status(200).json({
    msg: 'Listado de Tickets',
    supportTickets,
  });
};

const getSupportTicket = async (req, res) => {
  const { id } = req.params;
  const supportTicket = await SupportTicket.findById(id).populate('userId');

  res.status(200).json({
    msg: 'Ticket',
    supportTicket,
  });
};

const postSupportTicket = async (req, res) => {
  const body = req.body;
  console.log(body);
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

router.post('/', postSupportTicket);
router.get('/', getSupportTickets);
router.get('/:id', getSupportTicket);

module.exports = router;
