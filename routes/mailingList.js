const { Router } = require('express');
const router = Router();
const MailingListModel = require('../models/MailingList');

const getMailingList = async (req, res) => {
  const mailingList = await MailingListModel.find();

  res.status(200).json({
    msg: 'Listado de Mailing',
    mailingList,
  });
};

const postMailingList = async (req, res) => {
  const body = req.body;
  try {
    const mailList = new MailingListModel(body);

    const newMailing = await mailList.save();

    res.status(201).json({
      msg: 'Agregado en Mailing List',
    });
  } catch {
    console.log('error');
  }
};

router.get('/', getMailingList);
router.post('/', postMailingList);

module.exports = router;
