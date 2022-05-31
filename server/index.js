const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

const Recep = require("./model/reception");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://Pradeep:coder7976@cluster0.zs3kf.mongodb.net/Receptionist?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to mongo");
  })
  .catch(() => {
    console.log("Error connecting to Database");
  });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const User = await Recep.find({ username });
  if (User.length == 0) {
    console.log("Not found biro");
    res.send("Bad request");
  } else {
    console.log(User[0].username);
    res.send("OK");
    // User.map((resu) => {
    //   console.log(resu.username);
    // });
    // console.log(User);
    const Passwordcorrect = await bcrypt.compare(password, User[0].password);
    console.log("The output of the bycypt " + Passwordcorrect);
  }
});

app.post("/regesterr", async (req, res) => {
  const saltRounds = 10;
  const username = req.body.username;
  const password = req.body.password;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const Users = await Recep.find({ username });
  if (Users.length == 0) {
    console.log("Not found biro");
    console.log("Request received");
    const Recep1 = new Recep({
      username: username,
      password: passwordHash,
    });
    console.log(Recep1);
    const User = Recep.find({ username });
    Recep1.save();
    res.send(Recep1);
  } else {
    res.send(true);
  }
});

app.listen(7000, function () {
  console.log("Server started on port 7000");
});
