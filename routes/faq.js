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
      ok: true,
      msg: 'Agregado en FAQ List',
      response: newMailing
    });
  } catch {
    console.log('error');
  }
};

const putFaq = async (req, res) => {
  const {id} = req.params;
  const body = req.body;
  try {
    const updateFAQ = await FaqModel.findByIdAndUpdate(id, body, { new: true })

    res.status(201).json({
      ok: true,
      msg: 'FAQ Actializado',
      result: updateFAQ
    });
  } catch {
    console.log('error');
  }
};

const delFaq = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteFAQ = await FaqModel.findByIdAndDelete(id)

    res.status(201).json({
      ok: true,
      msg: 'FAQ Eliminado',
      result: deleteFAQ
    });
  } catch {
    console.log('error');
  }
};

router.get('/', getFaq);
router.post('/', postFaq);
router.put('/:id', putFaq);
router.delete('/:id', delFaq);

module.exports = router;
