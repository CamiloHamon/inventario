const turnHelper = require("../helpers/turn");
const moment = require("../middlewares/moment");
const venModel = require("../models/venModel");
const turnoModel = require("../models/turnoModel");
const gastosModel = require("../models/gastosModel");
const bajasModel = require("../models/bajasModel");
const pagoModel = require("../models/pagoModel");
const userModel = require("../models/userModel");
const helper = require("../helpers/helpers");
const valesModel = require("../models/valModel");
const invModel = require("../models/invModel");
const fiadosModel = require("../models/fiadosModel");

const reportes = {};

let total = 0,
  totalVendido = 0,
  totalGastos = 0,
  totalTurnosPagados = 0,
  totalVales = 0,
  totalEntradas = 0,
  totalFiadosPagadosHoy = 0,
  period = false;

reportes.toDay = async (idUser, date, dateFirst, dateLast) => {
  restored();
  const idTurn = turnHelper.idTurn(idUser);
  const userTurn = await turnoModel.findUserByidTurnInfo(idTurn);
  let content = getContent(date, userTurn);

  const ventas = await getVentas(content, dateFirst, dateLast);
  if (ventas) {
    content = ventas;
    content += await getTotal(4, "venta", "success", dateFirst, dateLast);
  }

  const gastos = await getGastos(content, dateFirst, dateLast);
  if (gastos) {
    content = gastos;
    content += await getTotal(2, "gastos", "danger", dateFirst, dateLast);
  }

  const bajas = await getBajas(content, dateFirst, dateLast);
  if (bajas) content = bajas;

  const pagos = await getPagos(content, dateFirst, dateLast);
  if (pagos) {
    content = pagos;
    content += await getTotal(3, "pagos", "danger", dateFirst, dateLast);
  }

  const vales = await getVales(content, dateFirst, dateLast);
  if (vales) {
    content = vales;
    content += await getTotal(3, "vales", "danger", dateFirst, dateLast);
  }

  const entradas = await getEntradas(content, dateFirst, dateLast);
  if (entradas) {
    content = entradas;
    content += await getTotal(2, "entradas", "primary", dateFirst, dateLast);
  }

  const fiadosPagadosHoy = await getFiadosPagadosHoy(content, dateFirst, dateLast);
  if (fiadosPagadosHoy) {
    content = fiadosPagadosHoy;
    content += await getTotal(2, "fiadosHoy", "success", dateFirst, dateLast);
  }

  total =
    totalVendido +
    totalFiadosPagadosHoy -
    totalGastos -
    totalTurnosPagados -
    totalVales -
    totalEntradas;

  content = getGananciaTotal(content, total);
  if (total > 0) content += await getTotal(1, "total", "success");
  else content += await getTotal(1, "total", "danger");

  content += `        </div>
                    </body>
                </html>`;

  return content;
};

async function getVentas(content, dateFirst, dateLast) {
  const ventas = await venModel.listPeriod(moment.toDay(), dateFirst, dateLast);
  content += `
    <div class="row justify-content-center align-items-center">
        <div class="col-9 px-0">
            <div class="col-12 text-center border border-bottom-0 bg-success" style="font-size: 11pt;">
                <strong style="color: white;">VENTAS</strong>
            </div>
            <table class="table table-bordered rounded mb-0">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">CÓD</th>
                        <th scope="col" class="text-center">NOMBRE PRODUCTO</th>
                        <th scope="col" class="text-center">CANT.</th>
                        <th scope="col" class="text-center">VALOR UNIDAD</th>
                        <th scope="col" class="text-center">VALOR TOTAL</th>
                    </tr>
                </thead>
                <tbody>
    `;
  if (ventas.length > 0) {
    for (const v of ventas) {
      content += `
            <tr>
            <th scope="row" class="text-center">${v.idProduct}</th>
            <td class="text-center">${v.name}</td>
            <td class="text-center">${v.amount}</td>
            <td class="text-center">$${new Intl.NumberFormat().format(
              v.unidad
            )}</td>
            <td class="text-right">$${new Intl.NumberFormat().format(
              v.total
            )}</td>
        </tr>
            `;
    }

    return content;
  }
  return null;
}

async function getGastos(content, dateFirst, dateLast) {
  const gastos = await gastosModel.listBillsPeriod(dateFirst, dateLast);
  if (gastos.length > 0) {
    content += `
        <div class="row justify-content-center align-items-center mt-3">
            <div class="col-9 px-0">
                <div class="col-12 text-center border border-bottom-0 bg-danger" style="font-size: 11pt;">
                    <strong style="color: white;">GASTOS</strong>
                </div>
                <table class="table table-bordered rounded mb-0">
                    <thead>
                        <tr>
                            <th scope="col" class="text-center">NO.</th>
                            <th scope="col" class="text-center">DESCRIPCIÓN</th>
                            <th scope="col" class="text-center">VALOR</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

    for (const g of gastos) {
      content += `
            <tr>
                <th scope="row" class="text-center">${g.no}</th>
                <td class="text-center text-uppercase">${g.name}</td>
                <td class="text-right text-uppercase">
                    $${new Intl.NumberFormat().format(g.price)}
                </td>
            </tr>
        `;
    }

    return content;
  }
  return null;
}

async function getBajas(content, dateFirst, dateLast) {
  const discharged = await bajasModel.listDischargedPeriod(dateFirst, dateLast);
  if (discharged.length > 0) {
    content += `
    <div class="row justify-content-center align-items-center mt-3">
        <div class="col-9 px-0">
            <div class="col-12 text-center border border-bottom-0 bg-danger" style="font-size: 11pt;">
                <strong style="color: white;">BAJAS</strong>
            </div>
            <table class="table table-bordered rounded mb-0">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">NO.</th>
                        <th scope="col" class="text-center">NOMBRE PRODUCTO</th>
                        <th scope="col" class="text-center">CANTIDAD</th>
                        <th scope="col" class="text-center">OBSERVACIÓN</th>
                    </tr>
                </thead>
                <tbody>
    `;
    for (const d of discharged) {
      content += `
        <tr>
            <th scope="row" class="text-center">${d.no}</th>
            <td class="text-center text-uppercase">${d.name}</td>
            <td class="text-center text-uppercase">${d.amount}</td>
            <td class="text-center text-uppercase">${d.descripcion}</td>
        </tr>
    `;
    }
    content += `
                </tbody>
            </table>
        </div>
    </div>
    `;
    return content;
  }
  return null;
}

async function getPagos(content, dateFirst, dateLast) {
  let pays = await pagoModel.listPagoPeriod(dateFirst, dateLast);
  if (pays.length > 0) {
    pays = await completePay(pays);
    content += `
        <div class="row justify-content-center mt-3">
            <div class="col-9 px-0 border">
                <div class="col-12 text-center bg-danger px-0"  style="font-size: 11pt;">
                    <strong style="color:white;">TURNOS PAGADOS</strong>
                </div>
                <table class="table rounded mb-0">
                    <thead>
                        <tr class="border-0">
                            <th scope="col" class="text-center"></th>
                            <th scope="col" class="text-center">NOMBRE DEL EMPLEADO</th>
                            <th scope="col" class="text-center">CARGO</th>
                            <th scope="col" class="text-center">TOTAL TURNO</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
    for (const p of pays) {
      content += `
            <tr>
                <th scope="row" class="text-center">
                <img src="http://localhost:3100/img/imgProfile/${p.imgProfile}" alt="" class="img-fluid rounded-circle" style="height: 50px">
                </th>
                <td class="text-center text-uppercase">${p.name}</td>
                <td class="text-center text-uppercase">${p.position}</td>
            `;
      const payLoans = await valesModel.findByIdDatePayPartial(p.idUserPayTurn, dateFirst, dateLast);
      if (payLoans.length > 0) {
        content += `
                <td class="text-right text-uppercase">
                    <span class="red text-center w-100"> VALES SALDADOS</span><br>
                `;
        let n = 1;
        let totalEnValesPagados = 0;
        for (const pL of payLoans) {
          content += `
                    Vale #${n}: $${helper.decimal(pL.price)} <br>`;
          totalEnValesPagados += Number(pL.price);
          n++;
        }
        const resta = Number(p.price) - Number(totalEnValesPagados);
        content += `
                        <hr class="my-1 py-1">
                        VALOR DEL TURNO:
                        <span class="text-info">
                        $${helper.decimal(p.price)}
                        </span><br>
                        PAGÓ EN VALES:<span class="text-info">
                        -$${helper.decimal(totalEnValesPagados)}
                        </span>
                        <br>
                        TOTAL PAGADO:
                        <span class="text-danger">
                            $${helper.decimal(resta)}
                        </span>
                        <br><br>
                    </td>
                </tr>
                `;
        totalTurnosPagados += resta;
      } else {
        content += `
                    <td class="text-right text-uppercase">
                       $${helper.decimal(p.price)}<br>
                    </td>
                </tr>
                `;
        totalTurnosPagados += Number(p.price);
      }
    }
    return content;
  }
  return null;
}

async function getVales(content, dateFirst, dateLast) {
  const loans = await valesModel.listLoansPeriod(dateFirst, dateLast);
  if (loans.length > 0) {
    content += `
    <div class="row justify-content-center align-items-center mt-3">
        <div class="col-9 px-0">
            <div class="col-12 text-center border border-bottom-0 bg-danger" style="font-size: 11pt;">
                <strong style="color:white">VALES</strong>
            </div>
            <table class="table table-bordered rounded mb-0">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">NO.</th>
                        <th scope="col" class="text-center">NOMBRE DEL EMPLEADO</th>
                        <th scope="col" class="text-center">CARGO</th>
                        <th scope="col" class="text-center">TOTAL VALE</th>
                    </tr>
                </thead>
                <tbody>
    `;
    for (const l of loans) {
      content += `
                <tr>
                    <th scope="row" class="text-center">${l.no}</th>
                    <td class="text-center text-uppercase">${l.name}</td>
                    <td class="text-center text-uppercase">${l.position}</td>
                    <td class="text-right text-uppercase">
                        $${helper.decimal(l.price)}
                    </td>
                </tr>
            `;
    }

    return content;
  }
  return null;
}

async function getEntradas(content, dateFirst, dateLast) {
  const inputs = await invModel.listInputsPeriod(dateFirst, dateLast);
  if (inputs.length > 0) {
    content += `
    <div class="row justify-content-center align-items-center mt-3">
        <div class="col-9 px-0">
            <div class="col-12 text-center border border-bottom-0 bg-primary" style="font-size: 11pt;">
                <strong style="color:white">ENTRADAS (INVERSIÓN)</strong>
            </div>
            <table class="table table-bordered rounded mb-0">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">PRODUCTO</th>
                        <th scope="col" class="text-center">ENTRADAS</th>
                        <th scope="col" class="text-center">PRECIO</th>
                    </tr>
                </thead>
                <tbody>
    `;
    for (const i of inputs) {
      content += `
            <tr>
                <th scope="row" class="text-center">${i.name}</th>
                <td class="text-center text-uppercase">${i.amountInput}</td>
                <td class="text-right text-uppercase">
                    $${helper.decimal(i.price)}
                </td>
            </tr>
            `;
    }

    return content;
  }

  return null;
}

async function getFiadosPagadosHoy(content, dateFirst, dateLast) {
  const fiadosHoy = await fiadosModel.saldadosPeriod(dateFirst, dateLast);

  if (fiadosHoy.length > 0) {
    content += `
        <div class="row justify-content-center align-items-center mt-3">
            <div class="col-9 px-0">
                <div class="col-12 text-center border border-bottom-0 bg-success" style="font-size: 11pt;">
                    <strong style="color:white">FIADOS PAGADOS</strong>
                </div>
                <table class="table table-bordered rounded mb-0">
                    <thead>
                        <tr>
                            <th scope="col" class="text-center">CLIENTE</th>
                            <th scope="col" class="text-center">PRODUCTO</th>
                            <th scope="col" class="text-center">PRECIO</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
    for (const fh of fiadosHoy) {
      content += `
            <tr>
                <th scope="row" class="text-center text-uppercase">
                    ${fh.cliente}
                </th>
                <td class="text-center text-uppercase">${fh.producto}</td>
                <td class="text-right text-uppercase">
                    ${helper.decimal(fh.price)}
                </td>
            </tr>
            `;
    }
    return content;
  }

  return null;
}

function getGananciaTotal(content) {
  content += `
    <div class="row justify-content-center align-items-center mt-3">
    <div class="col-9 px-0 border rounded">
        <div class="col-12 text-center border border-bottom-0 bg-success" style="font-size: 11pt;">
            <strong style="color:white">GANANCIA TOTAL</strong>
        </div>
        <table class="table rounded mb-0">
            <thead>
                <tr>
                    <th scope="col" class="text-center"></th>
                    <th scope="col" class="text-center"></th>
                </tr>
            </thead>
            <tbody>
    `;

  if (totalVendido) {
    const info = completeInfoGanancia(totalVendido, "+", "success", "VENTA");
    if (info) content += info;
  }

  if (totalFiadosPagadosHoy) {
    const info = completeInfoGanancia(
      totalFiadosPagadosHoy,
      "+",
      "success",
      "FIADOS PAGADOS"
    );
    if (info) content += info;
  }

  if (totalGastos) {
    const info = completeInfoGanancia(totalGastos, "-", "danger", "GASTOS");
    if (info) content += info;
  }

  if (totalTurnosPagados) {
    const info = completeInfoGanancia(
      totalTurnosPagados,
      "-",
      "danger",
      "TURNOS PAGADOS"
    );
    if (info) content += info;
  }

  if (totalVales) {
    const info = completeInfoGanancia(totalVales, "-", "danger", "VALES");
    if (info) content += info;
  }

  if (totalEntradas) {
    const info = completeInfoGanancia(totalEntradas, "-", "danger", "ENTRADAS");
    if (info) content += info;
  }

  return content;
}

function completeInfoGanancia(typeTotal, op, type, method) {
  if (typeTotal) {
    return `
        <tr>
            <th scope="row" class="text-right text-uppercase">${method}: </th>
            <th scope="row" class="text-center">
                <strong class="text-${type}">${op}</strong> 
                $ ${helper.decimal(typeTotal)}
            </th>
        </tr>
        `;
  }

  return null;
}

async function getTotal(colspan, method, type, dateFirst, dateLast) {
  let auxTotal = 0;
  if (method === "venta") {
    auxTotal = await venModel.totalPartial(dateFirst, dateLast);
    totalVendido = auxTotal;
  } else if (method === "gastos") {
    auxTotal = await gastosModel.totalGPartial(dateFirst, dateLast);
    totalGastos = auxTotal;
  } else if (method === "pagos") {
    auxTotal = totalTurnosPagados;
  } else if (method === "vales") {
    auxTotal = await valesModel.totalValesPartial(dateFirst, dateLast);
    totalVales = auxTotal;
  } else if (method === "entradas") {
    auxTotal = await invModel.totalInputsPartial(dateFirst, dateLast);
    totalEntradas = auxTotal;
  } else if (method === "fiadosHoy") {
    auxTotal = await fiadosModel.totalSaldadosPartial(dateFirst, dateLast);
    totalFiadosPagadosHoy = auxTotal;
  } else if (method === "total") {
    auxTotal = total;
    method = "ganancias";
  }

  return `
                    <tr class="table-${type} tableFixHead">
                        <td colspan="${colspan}" class="text-right table-${type} bg-${type} text-${type} text-uppercase"><strong>TOTAL ${method}:</strong></td>
                        <td class="text-right table-${type} bg-${type} text-${type}">
                            <strong>
                                $${new Intl.NumberFormat().format(auxTotal)}
                            </strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `;
}

async function completePay(pays) {
  for (const p of pays) {
    let userPay = await userModel.findByIdPosition(p.idUserPayTurn);
    userPay = userPay[0];
    p.name = userPay.name;
    p.imgProfile = userPay.imgProfile;
    p.position = userPay.position;
  }

  return pays;
}

function getContent(date, userTurn) {
  return `
    <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        </head>

        <style>
            .container-custom {
                border-collapse: collapse;
                table-layout: fixed;
                width: 600pt;
            }

            body {
                font-family: "Courier New", monospace;
                font-size: 9pt;
            }

            .bg-red {
                background-color: rgb(233, 162, 173);
            }

            .red {
                color: rgb(211, 69, 91) !important;
            }

            .table th, td {
                padding: 1.75pt 5pt!important;
            }
            .tableFixHead tr {
                box-shadow: 
                    inset 0px 4px 0px -2px rgb(211, 69, 91),
                    inset 0px -4px 0px -2px rgb(211, 69, 91); 
            }
        </style>

        <body>
            <div class="container-custom">
                <div class="row justify-content-center align-items-center mb-3">
                    <div class="col-9">
                        <div class="row justify-content-center align-items-center rounded border">
                            <div class="col-3 h-100 px-0 text-center">
                                <img src="https://i.postimg.cc/qRkBgmJC/logo.png" alt="error" class="img-fluid">
                            </div>
                            <div class="col-6 border border-bottom-0 border-top-0 text-center py-3">
                                <strong>CHISPITAS Y BRASITARS LA 71</strong><br>
                                <strong>NIT: 1024510750-4</strong><br>
                                <strong>CELULAR: 323 326 69 35</strong><br>
                                <strong>DIRECCION: BOSA RECREO</strong><br>
                            </div>
                            <div class="col-3 text-right" style="font-size: 9pt;">
                                <strong>FECHA: ${date} </strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center align-items-center mb-3">
                    <div class="col-8 border border-right-0 rounded-left">
                        <div class="row border-bottom">
                            <div class="col-4 border-right text-right" style="font-size: 11pt;"><strong>NOMBRE:</strong></div>
                            <div class="col-4 text-uppercase">${userTurn.name}</div>
                        </div>
                        <div class="row border-bottom">
                            <div class="col-4 border-right text-right" style="font-size: 11pt;"><strong>CARGO:</strong></div>
                            <div class="col-4 text-uppercase">${userTurn.cargo}</div>
                        </div>
                        <div class="row">
                            <div class="col-4 border-right text-right" style="font-size: 11pt;"><strong>BASE:</strong></div>
                            <div class="col-4">65000</div>
                        </div>
                    </div>
                    <div class="border rounded-circle" style="width: 73px!important; height: 73px!important;">
                        <img src="http://localhost:3100/img/imgProfile/${userTurn.imgProfile}" alt="" class="img-fluid">
                    </div>
                </div>
    `;
}

function restored() {
  total = 0;
  totalVendido = 0;
  totalGastos = 0;
  totalTurnosPagados = 0;
  totalVales = 0;
  totalEntradas = 0;
  totalFiadosPagadosHoy = 0;
  period = false;
}

module.exports = reportes;
