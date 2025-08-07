import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const TEMP_2FA_JWT_SECRET = process.env.TEMP_2FA_JWTKEY;
export const varifyToken = (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  if (typeof bearerToken !== "undefined") {
    jwt.verify(
      bearerToken.split(" ")[1],
      process.env.JWTKEY,
      (err, authData) => {
        if (err) {
          return res.json({
            status: 0,
            message: "Token expired",
          });
        } else {
          req.member_id = authData.id;
          req.member_unique_id = authData.member_unique_id;
          next();
        }
      }
    );
  } else {
    res.send("Invalid Token");
  }
};

export const varifyTokenOptional = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("token = ", token);
  if (token && token.startsWith("Bearer ")) {
    varifyToken(req, res, next);
  } else {
    next(); // Proceed without verifying token
  }
};
export const verifyTemp2FAToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(200).json({
      // Use status 200 with status:0 for your error pattern
      status: 0,
      message: "Temporary 2FA token required in Authorization header.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, TEMP_2FA_JWT_SECRET);
    if (decoded.purpose !== "2fa_verification_pending") {
      return res.status(200).json({
        status: 0,
        message: "Invalid token purpose for 2FA verification. Please re-login.",
      });
    }
    req.member_id = decoded.memberId; // Attach memberId to request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(200).json({
        status: 0,
        message: "2FA verification session expired. Please re-login.",
      });
    }
    console.error("Invalid or malformed temporary 2FA token:", error);
    return res.status(200).json({
      status: 0,
      message: "Invalid or malformed 2FA token. Please re-login.",
    });
  }
};
