const express = require("express");
const csrf = require("csurf");
const nodemailer = require("nodemailer");
const router = express.Router();
const {
  userContactUsValidationRules,
  validateContactUs,
} = require("../config/validator");
const csrfProtection = csrf();
router.use(csrfProtection);

//GET: display abous us page
router.get("/about-us", (req, res) => {
  res.render("pages/about-us", {
    pageName: "О нас",
  });
});

//GET: display shipping policy page
router.get("/shipping-policy", (req, res) => {
  res.render("pages/shipping-policy", {
    pageName: "Политика доставки",
  });
});

//GET: display careers page
router.get("/careers", (req, res) => {
  res.render("pages/careers", {
    pageName: "Карьера",
  });
});

//GET: display contact us page and form with csrf tokens
router.get("/contact-us", (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error");
  res.render("pages/contact-us", {
    pageName: "Связаться с нами",
    csrfToken: req.csrfToken(),
    successMsg,
    errorMsg,
  });
});

//POST: handle contact us form logic using nodemailer
router.post(
  "/contact-us",
  [userContactUsValidationRules(), validateContactUs],
  (req, res) => {
    // instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // company's email and password
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // email options
    const mailOpts = {
      from: req.body.email,
      to: process.env.GMAIL_EMAIL,
      subject: `Enquiry from ${req.body.name}`,
      html: `
      <div>
      <h2 style="color: #478ba2; text-align:center;">Имя клиента: ${req.body.name}</h2>
      <h3 style="color: #478ba2;">Электронная почта клиента: (${req.body.email})<h3>
      </div>
      <h3 style="color: #478ba2;">Сообщение клиента: </h3>
      <div style="font-size: 30;">
      ${req.body.message}
      </div>
      `,
    };

    // send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
        req.flash(
          "ошибка",
          "Произошла ошибка ... Проверьте подключение к Интернету и повторите попытку позже."
        );
        return res.redirect("/pages/contact-us");
      } else {
        req.flash(
          "успех",
          "Письмо успешно отправлено! Благодарим Вас за запрос."
        );
        return res.redirect("/pages/contact-us");
      }
    });
  }
);

module.exports = router;
