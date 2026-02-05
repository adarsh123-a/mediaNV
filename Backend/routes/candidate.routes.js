const express = require("express");
const { body, param, validationResult } = require("express-validator");
const pool = require("../db");

const router = express.Router();

/* GET all candidates */
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM candidates ORDER BY id DESC");
  res.json(result.rows);
});

/* GET candidate by ID */
router.get("/:id", param("id").isInt(), async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM candidates WHERE id=$1", [id]);

  if (result.rows.length === 0)
    return res.status(404).json({ message: "Candidate not found" });

  res.json(result.rows[0]);
});

router.post(
  "/",
  body("name").notEmpty(),
  body("age").isInt({ min: 18 }),
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const {
        name,
        age,
        email,
        phone,
        skills,
        experience,
        applied_position,
        status,
      } = req.body;

      const result = await pool.query(
        `INSERT INTO candidates
       (name, age, email, phone, skills, experience, applied_position, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
        [name, age, email, phone, skills, experience, applied_position, status],
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("POST /api/candidates error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

/* UPDATE candidate */
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE candidates SET
     name=$1, age=$2, phone=$3, skills=$4,
     experience=$5, applied_position=$6, status=$7,
     updated_at=CURRENT_TIMESTAMP
     WHERE id=$8 RETURNING *`,
    [
      req.body.name,
      req.body.age,
      req.body.phone,
      req.body.skills,
      req.body.experience,
      req.body.applied_position,
      req.body.status,
      id,
    ],
  );

  if (result.rows.length === 0)
    return res.status(404).json({ message: "Candidate not found" });

  res.json(result.rows[0]);
});

/* DELETE candidate */
router.delete("/:id", async (req, res) => {
  const result = await pool.query(
    "DELETE FROM candidates WHERE id=$1 RETURNING *",
    [req.params.id],
  );

  if (result.rows.length === 0)
    return res.status(404).json({ message: "Candidate not found" });

  res.json({ message: "Candidate deleted successfully" });
});

module.exports = router;
