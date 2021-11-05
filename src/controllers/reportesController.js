const pdf = require("html-pdf");
const path = require("path");
const reportes = require("../helpers/reportes");
const moment = require("../middlewares/moment");
const reportesController = {};
const fs = require("fs-extra");
const transporter = require("../config/mailer");
const flMessage = require("../helpers/flash");

reportesController.reportToDay = async (req, res, next) => {
  const idUser = req.user.idUser;
  const toDay = moment.toDay().replace(/[-]/g, "");
  const namePDF = `${toDay}_DIARIO`;
  const date = moment.toDay();
  const content = await reportes.toDay(idUser, date, date, date);
  try {
    await pdf
      .create(content, {
        orientation: "portrait",
        format: "A4",
        type: "pdf",
        timeout: "10000000",
        paginationOffset: 1,

        border: "0",

        border: {
          top: ".5in",
          bottom: ".5in",
        },
      })
      .toFile(`./src/public/pdf/${namePDF}.pdf`, async (err, rpta) => {
        if (!err) {
          await transporter.sendMail({
            from: `Reporte diario`,
            to: "asaderochispitasybrasitas71@gmail.com",
            subject: `Reporte diario: ${moment.toDay()}`,
            cc: 'camilohamonserna@gmail.com',
            html: "Este es tu reporte de ventas para el día de hoy:",
            attachments: [
              {
                filename: namePDF,
                path: `./src/public/pdf/${namePDF}.pdf`,
                contentType: "application/pdf",
              },
            ],
          });
          return res.status(200).json({ status: true, name: namePDF });
        } else return res.status(400).json({ status: false });
      });
  } catch (error) {
    return res.status(400).json({ status: false });
  }
};

reportesController.index = async (req, res, next) => {
  const view = { alert: [], error: [] };
  const msg = flMessage.messages(req.flash());
  if (msg) {
    msg.type === "info"
      ? (view.alert = msg.message)
      : (view.error = msg.message);
  }
  res.render("pages/reportes/reportes", view);
};

reportesController.generateReport = async (req, res, next) => {
  const { type, period } = req.body;
  let status = false;
  const idUser = req.user.idUser;
  if (type == 1) {
    // day
    const date = moment.dateMYSQL(period);
    const toDay = date.replace(/[-]/g, "");
    const namePDF = `DIA_${toDay}_REPORTE`;
    const content = await reportes.toDay(idUser, date, date, date);
    try {
      await pdf
        .create(content, {
          orientation: "portrait",
          format: "A4",
          type: "pdf",
          timeout: "10000000",
          paginationOffset: 1,
          border: "0",
          border: {
            top: ".5in",
            bottom: ".5in",
          },
        })
        .toFile(`./src/public/pdf/${namePDF}.pdf`, async (err, rpta) => {
          await transporter.sendMail({
            from: `Reporte para el día ${date}`,
            to: "asaderochispitasybrasitas71@gmail.com",
            subject: `Reporte para el día ${date}`,
            html: `Este es tu reporte de ventas para el día ${date}`,
            attachments: [
              {
                filename: namePDF,
                path: `./src/public/pdf/${namePDF}.pdf`,
                contentType: "application/pdf",
              },
            ],
          });
        });
      status = true;
    } catch (error) {
      console.log("error");
    }
  } else {
    const date = moment.toDay();
    const dayWeek = calcDayWeek();
    const lastDayMonth = moment.dateMYSQL(calcLastDayMonth(date));

    let dateFirst,
      dateLast,
      type = "ANUAL";

    switch (period) {
      case "1":
        dateFirst = `${moment.getYear()}-${moment.getMonth()}-${dayWeek - 6}`;
        dateLast = `${moment.getYear()}-${moment.getMonth()}-${dayWeek}`;
        type = "SEMANAL";
        break;
      case "2":
        type = "QUINCENAL";
        let firstDay = 1;
        if (moment.day() > 15) {
          dateLast = moment.dateMYSQL(calcLastDayMonth(date));
          firstDay = 15;
        } else {
          dateLast = moment.dateMYSQL(calcDayPartial(date));
        }
        dateFirst = `${moment.getYear()}-${moment.getMonth()}-${firstDay}`;
        break;
      case "3":
        type = "MENSUAL";
        dateFirst = `${moment.getYear()}-${moment.getMonth()}-1`;
        dateLast = lastDayMonth;
        break;
      case "4":
        type = "SEMESTRAL";
        if (moment.getMonth() > 6) {
          dateFirst = `${moment.getYear()}-7-1`;
          dateLast = `${moment.getYear()}-12-30`;
        } else {
          dateFirst = `${moment.getYear()}-1-01`;
          dateLast = `${moment.getYear()}-6-30`;
        }
        break;
      default:
        dateFirst = `${moment.getYear()}-1-01`;
        dateLast = `${moment.getYear()}-12-30`;
        break;
    }

    const datePartial =
      dateFirst.replace(/[-]/g, "") + "-" + dateLast.replace(/[-]/g, "");
    const namePDF = `${type}_${datePartial}_REPORTE`;
    const content = await reportes.toDay(idUser, date, dateFirst, dateLast);

    try {
      await pdf
        .create(content, {
          orientation: "portrait",
          format: "A4",
          type: "pdf",
          timeout: "10000000",
          paginationOffset: 1,
          border: "0",
          border: {
            top: ".5in",
            bottom: ".5in",
          },
        })
        .toFile(`./src/public/pdf/${namePDF}.pdf`, async (err, rpta) => {
          await transporter.sendMail({
            from: `Reporte ${type} - ${dateFirst} - ${dateLast}`,
            to: "asaderochispitasybrasitas71@gmail.com",
            subject: `Reporte ${type} - ${dateFirst} - ${dateLast}`,
            cc:'camilohamonserna@gmail.com',
            html: `Este es tu reporte de ventas con periodo ${type} - ${dateFirst} - ${dateLast}`,
            attachments: [
              {
                filename: namePDF,
                path: `./src/public/pdf/${namePDF}.pdf`,
                contentType: "application/pdf",
              },
            ],
          });
        });
      status = true;
    } catch (error) {
      console.log(error);
    }
  }

  status
    ? req.flash("info", "Reporte enviado por correo.")
    : req.flash("error", "Hubo un error, intente mas tarde.");
  return res.redirect("/reportes");
};

function calcLastDayMonth(date) {
  const fecha = new Date(date),
    y = fecha.getFullYear(),
    m = fecha.getMonth();
  return new Date(y, m + 1, 0);
}

function calcDayWeek() {
  const day = moment.day();
  return parseInt(day / 7) * 7 + 7;
}

function calcDayPartial(date) {
  const fecha = new Date(date),
    y = fecha.getFullYear(),
    m = fecha.getMonth();

  return new Date(y, m, 15);
}

module.exports = reportesController;
