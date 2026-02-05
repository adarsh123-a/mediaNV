const express = require("express");
const cors = require("cors");

const candidateRoutes = require("./routes/candidate.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/candidates", candidateRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
