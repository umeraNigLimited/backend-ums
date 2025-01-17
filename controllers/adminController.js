import db from "../dbModel/db.js";

const getStaffs = async (req, res) => {
  const { id } = req.body;
  try {
    const rows = db.query("SELECT * FROM staff WHERE staff_id = $1", [id]);
    res.json({ message: "this is some file" });
  } catch (err) {
    console.log(err);
  }
};

const getSingleStaff = async (req, res) => {
  res.json({ message: "this is some file" });
};

const addStaffs = async (req, res) => {
  res.json({ message: "this is some file" });
};

const updateStaff = async (req, res) => {
  res.json({ message: "this is some file" });
};

const deleteStaffs = async (req, res) => {
  res.json({ message: "this is some file" });
};

export { getStaffs, getSingleStaff, addStaffs, updateStaff, deleteStaffs };
