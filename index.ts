/* eslint-disable @typescript-eslint/no-var-requires */
import cors = require("cors");
require("dotenv").config({ path: "./.env" });
import express from "express";
import { expressjwt } from "express-jwt";
const jwks = require("jwks-rsa");
const reminders = require("./routes/reminders");
const app = express();

const PORT = process.env.PORT || 3000;

const jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKSURI,
  }),
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ["RS256"],
});

app.use(jwtCheck);

const origins = process.env.ORIGINS;
if (!origins) {
  console.error(
    `Origins value cannot be undefined.  Origins should be a comma-separated list of origins.  Please fix.`
  );
  process.exit(1);
}
const splitOrigins = origins.split(",");
app.use(
  cors({
    origin: splitOrigins,
  })
);
// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use("/reminders", reminders);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
