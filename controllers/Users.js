const { response, request } = require("express");
const Users = require("../models/Users");

const getUsers = async (req = request, res = response) => {
  const users = await Users.find();

  res.status(200).json({
    msg: "Listado de clientes",
    users,
  });
};

const getUser = async (req = request, res = response) => {
  res.status(200).json({
    msg: "Listado de clientes",
  });
};

const postUser = async (req = request, res = response) => {
  console.log("post");
  try {
    const user = new Users(req.body);

    await user.save();

    res.status(201).json({
      ok: true,
      msg: "Creado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const putUser = async (req = request, res = response) => {
  const form = req.body[0];
  const accountID = req.body[1];

  try {
    const user = Users.findById(accountID);

    if (!user) {
      res.status(404).json({
        ok: false,
        msg: "No Encontrado",
      });
    }
    const nuevoUser = await Users.findByIdAndUpdate(accountID, form, { new: true });

    res.status(200).json({
      ok: true,
      msg: "Actualizado Correctamente",
      nuevoUser,
    });
  } catch (error) {
    res.status(501).json({
      ok: false,
      msg: "Error en la peticion",
      error,
    });
  }
};

const deleteUser = async (req = request, res = response) => {
  res.status(200).json({
    msg: "Listado de clientes",
  });
};

module.exports = {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
};
