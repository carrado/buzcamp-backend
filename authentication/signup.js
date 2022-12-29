import { router as _router, CryptoJS as _CryptoJS, conn as _mysqlConn, jwt, jwtSecretKey, axios, jwt_decode } from "../component/appHeaders.js";

_router.post("/createuser", function (req, res, next) {
  var name = _CryptoJS.RabbitLegacy.decrypt(req.body.__user, "my-secret-key@123");
  var decryptedName = name.toString(_CryptoJS.enc.Utf8);

  var nation = _CryptoJS.RabbitLegacy.decrypt(req.body.__rdNati, "ecret-key@123");
  var decryptedNation = nation.toString(_CryptoJS.enc.Utf8);

  var school = _CryptoJS.RabbitLegacy.decrypt(req.body.__isSch, "my-secret-key@123");
  var decryptedSchool = school.toString(_CryptoJS.enc.Utf8);

  var department = _CryptoJS.RabbitLegacy.decrypt(
    req.body.__cmDept,
    "my-secreets-key@123"
  );
  var decryptedDepartment = department.toString(_CryptoJS.enc.Utf8);

  var email = _CryptoJS.RabbitLegacy.decrypt(req.body.__tmrMal, "my-secret-key@123");
  var decryptedEmail = email.toString(_CryptoJS.enc.Utf8);

  var username = _CryptoJS.RabbitLegacy.decrypt(req.body.__bzuser, "my-secret-key@23");
  var decryptedUsername = username.toString(_CryptoJS.enc.Utf8);

  var password = _CryptoJS.RabbitLegacy.decrypt(req.body.tCheck, "my-secret-key@123");
  var decryptedPassword = password.toString(_CryptoJS.enc.Utf8);

  var userId = _CryptoJS.RabbitLegacy.decrypt(req.body.__chQP, "buzy-my-secret-key@123");
  var decryptedUserId = userId.toString(_CryptoJS.enc.Utf8);

  var tokenNo = (Math.floor(Math.random() * 10000) + 90000).toString();

  var currentTime = Math.floor(Date.now() / 1000);
  var tokenExpires = currentTime + (60 * 60).toString();

  let data = {
    name: decryptedName,
    nationality: decryptedNation,
    school: decryptedSchool,
    department: decryptedDepartment,
    email: decryptedEmail,
    username: decryptedUsername,
    password: decryptedPassword,
    userId: decryptedUserId,
    verification: "",
    token: tokenNo,
    tokenElapse: tokenExpires,
  };

  let sql = `SELECT * FROM users WHERE username = '${data.username}' OR email = '${data.email}'`;
  let fquery = _mysqlConn.query(sql, (err, results) => {
    if (results.length > 0) {
      results.forEach((result) => {
        if (result.email === data.email) {
          res.status(405).send({
            success: false,
            message: `User with email '${data.email}' already exists`,
          });
        }
        else if (result.username === data.username) {
          res.status(405).send({
            success: false,
            message: `User with username '${data.username}' already exists`,
          });
        }
      });
    } else {
      let sql_2 = `INSERT INTO users (name, nationality, school, department, email, username, password, userId, verification, token, tokenElapse) 
      VALUES ('${data.name}', '${data.nationality}', '${data.school}', '${data.department}',
      '${data.email}', '${data.username}', '${data.password}', '${data.userId}', '${data.verification}', '${data.token}', '${data.tokenElapse}')`;

      let query = _mysqlConn.query(sql_2, function (err, result) {
        if (err) {
          res
            .status(405)
            .send({ success: false, message: "Error in creating User" });
        }
        else {
          let tokenData = {
            email: `${data.email}`,
          }

          const token = jwt.sign(tokenData, jwtSecretKey);

          res.status(200).send({
            success: true,
            message: "Account created successfully",
            data: {__tkI9shaB: token}
          });

          const dataBody = {
            personalizations: [
              {
                to: [
                  {
                    email: `${data.email}`,
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
                  '<div style="border: 1px solid #eee; width: 388px; padding: 46px 45px; margin: 50px auto"><span style="margin-top: 20px; font-size: 18px">Use the OTP below to validate your BuzCamp Account:</span><p style="margin-top: 10px; font-weight: bolder; font-size: 20px">' +
                  data.token +
                  '</p><span style="margin-top: 13px; font-size: 18px">This token will expire in an hour time. Please do not share this token with anyone.</span><span style="margin-top: 15px; font-size: 18px">Thanks !<p style="font-size: 20px; font-weight: bolder">BuzCamp</p></div>',
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
            .then((data) => res.json(data))
            .catch((err) => next(err));
        }
      });
    }
  });
});








_router.get("/_grantprm/:id", (req, res) => {
  const token = req.params.id;

  var decoded = jwt_decode(token);
  
  let sql = `SELECT * FROM users WHERE email = '${decoded.email}' AND token != ''`;
  conn.query(sql, (err, results) => {
    if (results.length === 0) {
    }
    else {
      res.status(200).send({
        success: true,
        subscribed: false,
      });
    }
  })
});

export default _router;
