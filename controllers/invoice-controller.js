const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');
const {} = require('../service/plan-service');
const Invoice = require('../models/Invoice');
const UserModel = require('../models/User');
const PlanService = require('../services/planTime-service');

const getAllInvoices = async(req = request, res = response) => {
  try {
      const invoices = await Invoice.find();

      res.status(200).json({
          ok: true,
          invoices
      });
  }catch (error) {
      res.status(500).json({
          ok: false,
          message: 'No se pudo acceder a las facturas, contacte un administrador.',
          errorDescription: error.message
      });
  }
}

const getAllInvoicesUser = async(req = request, res = response) => {
  const token = req.myPayload;

  try {
      const invoice = await Invoice.find({userId: token.sub.id});

      if(!invoice) return res.status(404).json({
          ok: false,
          message: 'Este usuario no tiene facturas'
      });

      res.status(200).json({
          ok: true,
          invoice
      });
  }catch (error) {
      res.status(500).json({
          ok: false,
          message: 'No se pudo acceder a la factura, contacte un administrador.',
          errorDescription: error.message
      });
  }
}

const getInvoiceById = async(req = request, res = response) => {
    const { invoiceId } = req.params;

    if(!isValidObjectId(invoiceId)) return res.status(400).json({
        ok: false,
        message: 'Id de formulario inválido.'
    });

    try {
        const invoice = await Invoice.findById(invoiceId);

        if(!invoice) return res.status(404).json({
            ok: false,
            message: 'No pudimos encontrar ninguna factura con ese Id.'
        });

        res.status(200).json({
            ok: true,
            invoice
        });
    }catch (error) {
        res.status(500).json({
            ok: false,
            message: 'No se pudo acceder a la factura, contacte un administrador.',
            errorDescription: error.message
        });
    }
}

const createNewInvoice = async (req = request, res = response) => {
  try {
      const newInvoice = new Invoice(req.body.data);
      await newInvoice.save();
      const idInvoice = newInvoice.id ? newInvoice.id : newInvoice._id

      const expireDate = PlanService.generateExpirationTime()

      const user = await UserModel.findById(req.body.data.userId)

      let plan = {}
      if(newInvoice.status === 'paid'){
        plan = {
          planInfo: req.body.data.plan,
          expireDate: expireDate,
          paymentMethod: idInvoice
        }
      }else{
        plan = {
          ...user.plan
        }
      }

      await UserModel.findByIdAndUpdate(req.body.data.userId, {
        profileLicense: req.body.data.plan,
        plan
      },{
        new: true,
      })

      res.status(201).json({
          ok: true,
          invoice: newInvoice
      });
  } catch (error) {
      res.status(500).json({
          ok: false,
          message: 'No se pudo crear la nueva factura, contacte un administrador.',
          errorDescription: error.message
      });
  }
}

module.exports = {
  getAllInvoices,
  getAllInvoicesUser,
  getInvoiceById,
  createNewInvoice
}
