const { Router } = require('express');
const router = Router();
const FaqModel = require('../models/Faq');

const getFaq = async (req, res) => {
  const faqList = await FaqModel.find();

  res.status(200).json({
    msg: 'Listado de FAQ',
    faqList,
  });
};

const postFaq = async (req, res) => {
  const body = req.body;
  try {
    const faqList = new FaqModel(body);
    const newMailing = await faqList.save();

    res.status(201).json({
      msg: 'Agregado en FAQ List',
    });
  } catch {
    console.log('error');
  }
};

router.get('/', getFaq);
router.post('/', postFaq);

module.exports = router;
