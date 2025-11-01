const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

app.post("/save", async (req, res) => {
  const { ip, timestamp, city, country, latitude, longitude } = req.body;

  try {
    const { error } = await supabase
      .from("visitors")
      .insert([{ ip, timestamp, city, country, latitude, longitude }]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Saved");
    res.sendStatus(200);
  } catch (err) {
    console.error(err.name, ":", err.message);
  }
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
