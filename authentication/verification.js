import { router as _router, CryptoJS as _CryptoJS, conn as _mysqlConn, jwt, axios, jwtSecretKey } from "../component/appHeaders.js";

_router.post("/verifyAccount", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x - client - key, x - client - token, x - client - secret, Authorization");

    var currentTime = Math.floor(Date.now() / 1000).toString();

    var token = req.body.__tkLd5a;

    var userId = "";

    let sql = `SELECT * FROM users WHERE token = '${token}' AND tokenElapse < '${currentTime}'`;
    let fquery = _mysqlConn.query(sql, (err, results) => {
        results.forEach((result) => {
            userId = result.userId;
        });

        if (results.length > 0) {
            let sql_1 = `UPDATE users SET verification = '${req.sessionID}', token = '', tokenElapse = '' WHERE userId = '${userId}'`;
            _mysqlConn.query(sql_1, function (err, result) {
                if (err) {
                    res.status(405).send({
                        success: false,
                        subscribed: false,
                        message: "Error in validating OTP",
                    });
                }
                else {
                    let tokenData = {
                        session: `${req.sessionID}`,
                    }

                    const jsToken = jwt.sign(tokenData, jwtSecretKey);

                    res.status(200).send({
                        success: true,
                        subscribed: true,
                        data: { __tkI9shaB: jsToken }
                    });
                }
            });
        } else {
            res.status(405).send({
                success: false,
                subscribed: false,
                message: "OTP entered is invalid",
            });
        }
    });
});



_router.post("/resendToken", function (req, res, next) {

    var email = _CryptoJS.RabbitLegacy.decrypt(req.body.__mailKQr, "my-secret-key@23");
    var decryptedEmail = email.toString(_CryptoJS.enc.Utf8);

    var name = '';

    var tokenNo = (Math.floor(Math.random() * 10000) + 90000).toString();

    var currentTime = Math.floor(Date.now() / 1000);
    var tokenExpires = currentTime + (60 * 60).toString();

    const token = jwt.sign(decryptedEmail, jwtSecretKey);


    let sql = `SELECT * FROM users WHERE email = '${decryptedEmail}'`;
    _mysqlConn.query(sql, (err, results) => {
        if (results.length > 0) {

            let sql_1 = `UPDATE users SET tokenElapse = '${tokenExpires}', token = '${tokenNo}' WHERE email = '${decryptedEmail}'`;
            _mysqlConn.query(sql_1);

            results.forEach((result) => {
                name = (result.name).split(" ");
            });

            const dataBody = {
                personalizations: [
                    {
                        to: [
                            {
                                email: `${decryptedEmail}`,
                            },
                        ],
                        subject: "OTP for Account Verification",
                    },
                ],
                from: {
                    name: "Carrado",
                    email: "support@buzcamp.com",
                },
                content: [
                    {
                        type: "text/html",
                        value:
                            '<div style="border: 1px solid #eee; width: 388px; padding: 25px 45px; margin: 50px auto">' +
                            '<span style="margin-top: -10px;">' +
                            '<p align="center">' + '<img src="https://res.cloudinary.com/campnet/image/upload/c_scale,w_64/v1672337722/buzcamp_ueebyf.png" />' +
                            '</p>' +
                            '<h3 style="font-family: Roboto,Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.5em">' +
                            '<strong>' + 'Use the OTP below to validate your BuzCamp Account:' + '</strong>' +
                            '</h3>' +
                            '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; margin-top: 10px; font-size: 16px; line-height: 1.5em">' +
                            tokenNo + '</p > ' +
                            '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; margin-top: 10px; font-size: 16px; line-height: 1.5em">' +
                            'This token will expire in an hour time. Please do not share this token with anyone.' +
                            '<span style="margin-top: 35px;">' +
                            '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.5em">' +
                            'Thanks,' +
                            '</p>' +
                            '<p style="font-family: Roboto,Helvetica,Arial,sans-serif; font-size: 16px; line-height: 1.5em">' +
                            '<strong>' + 'Carrado Team' + '</strong> </p>' +
                            '</span>' +
                            '</div>',
                    },
                ],
            };

            const options = {
                method: "POST",
                url: `${process.env.EMAIL_API}`,
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Key":
                        "d77e58d745msh315ac01c190b056p15860ajsnc32644a77641",
                    "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
                },
                data: dataBody,
            };

            axios
                .request(options)
                .then(() => res.status(200).send({
                    success: true, message: `A verification code has been sent to ${decryptedEmail}`,
                    data: { __tkI9shaB: token }
                }))
                .catch((err) => res.status(405).send({ success: false, message: `Error in sending verification code to ${decryptedEmail} ` }));
        }
        else {
            // Credentials entered does not have a valid User
            res.status(405).send({
                success: false,
                subscribed: false,
                message: "No account with this email address",
            });
        }
    });
});


export default _router;

