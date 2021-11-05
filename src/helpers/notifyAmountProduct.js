require("dotenv").config();

const notifyAmountProduct = async (nameProduct, amount) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: `El producto *${nameProduct}* tiene *${amount}* existencias, se le recomienda pedir o surtir este producto.`,
      from: "whatsapp:+14155238886",
      to: "whatsapp:+573232390842",
    })
    .then((message) => console.log(message.sid))
    .done();
};

module.exports = notifyAmountProduct;
