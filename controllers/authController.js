import db from "../dbModel/db.js";
import crypto, { hash } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { idEmail, handleResetPassword } from "../utlities/emails/emails.js";

//JWT

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//Login Staff
export const loginStaff = async (req, res) => {
  const { staff_id, office_email, password } = req.body;

  //Validation
  if (!office_email || !password) {
    res.status(400).json("All feild must be filled");
  }

  try {
    const { rows } = await db.query(
      `SELECT auth.staff_id, last_name, position, staff_role, staff.department, hashed_password
       FROM auth 
       JOIN staff 
       ON auth.staff_id = staff.staff_id 
       WHERE office_email = $1`,
      [office_email]
    );

    // console.log(rows);
    // console.log(rows[0]);
    const hashedPassword = rows[0].hashed_password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
      console.log(rows[0].staff_id);
      const token = createToken(rows[0].staff_id);
      console.log(rows[0].department);
      res.json({
        msg: "User logged in",
        data: {
          staffID: staff_id,
          email: office_email,
          lastName: rows[0].last_name,
          position: rows[0].postion,
          role: rows[0].staff_role,
          department: rows[0].department,
          token: token,
        },
      });
    } else {
      res.status(400).json("Invalid Password");
    }
  } catch (err) {
    console.log(err);
  }
};

//Register Staff
export const registerStaff = async (req, res) => {
  const {
    lastName,
    otherName,
    personalEmail,
    officeEmail,
    birthDate,
    joinDate,
  } = req.body;
  try {
    const rows = await db.query(
      "SELECT * FROM emails WHERE email_address = $1",
      [officeEmail]
    );
    if (rows.rowCount > 0) {
      //   try {
      // const salt = await bcrypt.genSalt(10);
      // const hash = await bcrypt.hash(password, salt);
      const result = await db.query(
        "INSERT INTO staff (last_name, other_name, personal_email, office_email, birth_date, join_date) VALUES ($1,$2,$3,$4,$5, $6) RETURNING *",
        [lastName, otherName, personalEmail, officeEmail, birthDate, joinDate]
      );

      const newStaffMember = result.rows[0];
      const { staff_id, last_name, office_email } = newStaffMember;
      await idEmail(staff_id, last_name, office_email);
      res.status(200).json({ message: "Succesfully Registered Staff" });
      //   } catch (err) {
      //     console.log(err);
      //   }
    } else {
      res
        .status(400)
        .json({ message: "Sorry, Email doesn't exit in database" });
    }
  } catch (err) {
    console.log(err);
  }
};

//Verification of Staff
export const sendVerification = async (req, res) => {
  const { officeEmail } = req.body;
  try {
    const { rows } = await db.query(
      "SELECT * FROM staff WHERE office_email = $1",
      [officeEmail]
    );
    // console.log(rows);
    if (rows.length > 0) {
      //Send Reset Token
      const staff_id = rows[0].staff_id;
      const staff_email = rows[0].office_email;
      const setToken = crypto.randomBytes(32).toString("hex");
      const hashed = crypto.createHash("sha256").update(setToken).digest("hex");
      let expiringTime = Math.floor((Date.now() + 10 * 60 * 1000) / 1000);

      const result = await db.query(
        "INSERT INTO password_resets (staff_id, reset_token, expires_at) VALUES($1,$2,to_timestamp($3))",
        [staff_id, hashed, expiringTime]
      );
      //Send to Staff Email
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/staff/reset_password/${setToken}`;
      await handleResetPassword(resetUrl, staff_email);
      res.status(200).json({ message: "Successfully Stored" });
    } else {
      // console.log(rows);
      res.status(400).json({ message: "Email doee not exist" });
    }
  } catch (err) {
    console.error(err);
  }
};

//Create Password
export const creatingPassword = async (req, res) => {
  const { staff_id, password } = req.body;

  // Validation
  if (!staff_id || !password) {
    return res.status(400).json("Staff ID and Password must be filled");
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json("Password is not Strong Enough");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    // Insert the new hashed password
    const { rows: authRows } = await db.query(
      "INSERT INTO auth (staff_id, hashed_password) VALUES ($1, $2) RETURNING *",
      [staff_id, hashPassword]
    );

    const token = createToken(authRows[0].staff_id); // Generate token if needed

    return res.status(201).json({
      message: "Password successfully created for staff member",
      data: authRows[0], // Return the newly created auth record
      token: token, // Optionally return token if it's required
    });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.detail });
  }
};

//Reset Password
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  //Validation
  if (!password) {
    return res.status(400).json("Password must be filled");
  }

  // if (!validator.isEmail(officeEmail)) {
  //  return  res.status(400).json("Not a Valid Email");
  // }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json("Password is not Strong Enough");
  }

  const hashedToken = crypto.createHash("sha256").update(id).digest("hex");
  // console.log(hashedToken);

  //bycrypt
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    // Fetch details for the reset token
    const { rows: resetRows } = await db.query(
      `SELECT staff.staff_id, office_email, last_name, position, staff_role, expires_at 
       FROM password_resets 
       JOIN staff 
       ON password_resets.staff_id = staff.staff_id 
       WHERE reset_token = $1`,
      [hashedToken]
    );
    // console.log(resetRows);
    if (resetRows.length === 0) {
      // Token does not exist
      return res.status(400).json({ message: "Invalid Token" });
    }

    const resetData = resetRows[0]; // Get the first (and only) row
    const currentDate = Date.now();

    // Check if the token is expired
    if (currentDate > new Date(resetData.expires_at).getTime()) {
      return res.status(400).json({ message: "Expired Token" });
    }

    const staffID = resetData.staff_id;
    // Insert the new hashed password
    // const { rows: authRows } = await db.query(
    //   "INSERT INTO auth (staff_id, hashed_password) VALUES ($1, $2) RETURNING *",
    //   [staffID, hashPassword]
    // );

    // await db.query(
    //   `UPDATE password_resets
    //    SET reset_token = udefined, used = true
    //    WHERE staff_id = $1`,
    //   [staffID]
    // );

    // const { rows: authRows } = await db.query(
    //   `
    //   WITH inserted_auth AS (
    //     INSERT INTO auth (hashed_password)
    //     VALUES ($1) WHERE staff_id = $2
    //     RETURNING staff_id -- Return only the relevant column
    //   )
    //   UPDATE password_resets
    //   SET reset_token = NULL, used = true
    //   WHERE staff_id = (SELECT staff_id FROM inserted_auth)
    //   RETURNING *
    //   `,
    //   [staffID, hashPassword]
    // );

    const { rows: authRows } = await db.query(
      `
      WITH updated_auth AS (
        UPDATE auth
        SET hashed_password = $1
        WHERE staff_id = $2
        RETURNING staff_id -- Return only the relevant column
      )
      UPDATE password_resets
      SET reset_token = NULL, used = true
      WHERE staff_id = (SELECT staff_id FROM updated_auth)
      RETURNING *
      `,
      [hashPassword, staffID]
    );

    console.log(authRows[0]);
    const token = createToken(authRows[0].staff_id);
    return res.status(200).json({
      message: "Successfully reset password",
      data: resetRows[0], // Return the newly created auth record
      token: token,
    });
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error:", err);

    // Send an error response
    return res
      .status(500)
      .json({ message: "An error occurred", error: err.message });
  }
};

// export const registerStaff = async ()=> {
//     try {

//     }catch(err) {

//     }
// }
