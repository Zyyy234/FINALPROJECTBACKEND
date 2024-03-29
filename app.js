const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = "wdadqkjbjbjgsefjqlkweq;lwlekqwhiohqiowbq[]12333487589jkjawbdjawbdjka";
const mongoUrl = "mongodb+srv://user:Laverne123*@cluster0.kkre8fz.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to database");
}).catch(e => console.log(e));

require("./userDetails");
const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const {
    fname,
    lname,
    disabilityType,
    skill,
    gender,
    address,
    contactNumber,
    email,
    password,
    userType
  } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({
      email
    });

    if (oldUser) {
      return res.json({
        error: "User Exists"
      });
    }

    await User.create({
      fname,
      lname,
      disabilityType,
      skill,
      gender,
      address,
      contactNumber,
      email,
      password: encryptedPassword,
      userType
    });
    res.send({
      status: "ok"
    });

  } catch (error) {
    res.send({
      status: "Error"
    });
  }
});

app.post("/login-user", async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const user = await User.findOne({
    email
  });
  if (!user) {
    return res.json({
      error: "User not found"
    });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({
      email: user.email
    }, jwt_secret, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({
        status: "ok",
        data: token
      });
    } else {
      return res.json({
        error: "error"
      });
    }
  }
  res.json({
    status: "error",
    error: "Invalid Password"
  });
});

app.post("/userData", async (req, res) => {
  const {
    token
  } = req.body;
  try {
    const user = jwt.verify(token, jwt_secret, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({
        status: "error",
        data: "token expired"
      });
    }

    const userEmail = user.email;
    User.findOne({
      email: userEmail
    }).then((data) => {
      res.send({
        status: "ok",
        data: data
      });
    }).catch((error) => {
      res.send({
        status: "error",
        data: error
      });
    })
  } catch (error) {}
});

app.listen(3000, () => {
  console.log("Server Started");
});

app.post("/post", async (req, res) => {
  console.log(req.body);
  const {
    data
  } = req.body;

  try {
    if (data == "Sample") {
      res.send({
        status: "ok"
      });
    } else {
      res.send({
        status: "User not found"
      });
    }
  } catch (error) {

    res.send({
      status: "Something went wrong try again"
    });
  }
});

app.get("/getUser/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const user = await User.findById(id).exec();
    res.send({
      status: "ok",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "error",
      data: error
    });
  }
});

app.put("/updateUser/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const {
        fname,
        lname,
        disabilityType,
        skill,
        gender,
        address,
        contactNumber,
        email,
        password,
        userType
      } = req.body;
  
      const updatedUser = {
        fname,
        lname,
        disabilityType,
        skill,
        gender,
        address,
        contactNumber,
        email,
        password,
        userType
      };
  
      await User.findByIdAndUpdate(id, updatedUser).exec();
      res.send({
        status: "ok",
        data: "updated"
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "error",
        data: error
      });
    }
  });
  

app.get("/getAllUser", async (req, res) => {
  try {
    const allUsers = await User.find({}).exec();

    res.send({
      status: "ok",
      data: allUsers
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "error",
      data: error
    });
  }
});

app.post("/deleteUser", async (req, res) => {
  try {
    const {
      userid
    } = req.body;
    await User.deleteOne({
      _id: userid
    });
    res.send({
      status: "ok",
      data: "deleted"
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "error",
      data: error
    });
  }
});
