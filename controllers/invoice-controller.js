const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');
const Invoice = require('../models/Invoice');
const UserModel = require('../models/User');
const PlanModel = require('../models/Product');
const PlanService = require('../services/planTime-service.js');
const PLAN = require("../constants/planes")
const { receiptMail } = require('../mails/receiptMail');

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
    //guardando factura
    const newInvoice = new Invoice(req.body);
    const invoice = await newInvoice.save();
    const idInvoice = invoice.id ? invoice.id : invoice._id

    //creando fechas de expiracion para el plan
    const product = await PlanModel.findById(invoice.plan)
    const user = await UserModel.findById(invoice.userId)

    const productExpired = product.paymentMethods.filter(item => item.name === invoice.formSelectPaymentMethod)

    const timeLeft = user.plan.expireDate === 'expired' ? new Date().getTime() : new Date(user.plan.expireDate).getTime()
    const expireDate = PlanService.generateExpirationTime(productExpired[0].time, timeLeft)

    let plan = {}
    if(invoice.status === 'paid'){
      plan = {
        planInfo: invoice.plan,
        expireDate: expireDate,
        paymentMethod: idInvoice,
        extraTime: user.plan.extraTime,
        availableModules: invoice.plan == PLAN.employee  ? true : false
      }
    }else{
      plan = {
        ...user.plan
      }
    }


    await UserModel.findByIdAndUpdate(invoice.userId, {
      profileLicense: invoice.plan,
      plan
    },{
      new: true,
    })

    //enviando notificacion al usurio por sendGrid
    const objectMail = {
      createdAt: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
      expireDate: expireDate,
      invoiceNo: idInvoice,
      userName: `${user.name} ${user.fistLastName}`,
      userEmail: user.email,
      amount: `${newInvoice.total} COP`
    }

    await receiptMail(
      objectMail.createdAt,
      objectMail.expireDate,
      objectMail.invoiceNo,
      objectMail.userName,
      objectMail.userEmail,
      objectMail.amount,
    )

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
