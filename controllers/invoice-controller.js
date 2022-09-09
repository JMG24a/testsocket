const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const Invoice = require('../models/Invoice');

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
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();

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
    getInvoiceById,
    createNewInvoice
}