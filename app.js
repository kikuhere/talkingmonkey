const express = require("express");
const ejs = require("ejs");
const app = express();
const say = require("say");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let is_speaking = false;
let text = null;
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  text = req.body.text;
  const voice = req.body.voice;
  const speed = req.body.speed;
  res.redirect("/");
  is_speaking = true;
  say.speak(text, voice, speed, (err) => {
    if (err) console.log(err);
    is_speaking = false;
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server Started at ${process.env.PORT}`);
});

// say.getInstalledVoices((err, voice) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(voice);
// });

// all voices :
// 'Microsoft Hazel Desktop',
// 'Microsoft David Desktop',
// 'Microsoft Zira Desktop
