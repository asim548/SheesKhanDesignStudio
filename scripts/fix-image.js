require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const r = await mongoose.connection.db.collection("designs").updateOne(
    { slug: "zariyan" },
    {
      $set: {
        "images.0.url":
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
      },
    }
  );
  console.log(r);
  await mongoose.disconnect();
})();
