const express = require("express");
const router = express.Router();

const reportesController = require("../controllers/reportesController");

const { isLoggedIn, isAdmin } = require("../helpers/auth");

router.get("/reportes", isLoggedIn, isAdmin, reportesController.index);

router.post(
  "/generarReporte",
  isLoggedIn,
  isAdmin,
  reportesController.generateReport
);

router.get("/reportes/fiados", isLoggedIn, (req, res, next) => {
  res.render("pages/reportes/reportes-fiados");
});

router.get("/reportes/fiados/editar", isLoggedIn, (req, res, next) => {
  res.render("pages/reportes/reportes-fiados-editar");
});

module.exports = router;
