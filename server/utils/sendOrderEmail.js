const transporter = require(
  "../config/mailer"
);

async function sendOrderEmail({
  to,
  order
}) {
  try {
    const info =
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to,

        subject:
          "Оплата заказа MyShop Market",

        html: `
          <h1>Спасибо за покупку</h1>

          <p>
            Заказ №${order.id}
            успешно оплачен.
          </p>
        `
      });

    console.log(
      "EMAIL SENT:",
      info.messageId
    );

    return info;
  } catch (error) {
    console.error(
      "EMAIL ERROR:",
      error
    );

    throw error;
  }
}

module.exports = sendOrderEmail;