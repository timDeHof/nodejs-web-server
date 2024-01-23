const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    res.json({ success: `User ${user} is logged in!` });
    // create JWTs
    // const accessToken = jwt.sign(
    //   { username: foundUser.username },
    //   process.env.ACCESS_TOKEN_SECRET
    // );
    // const refreshToken = jwt.sign(
    //   { username: foundUser.username },
    //   process.env.REFRESH_TOKEN_SECRET
    // );
    // Saving refreshToken with current user
    // const otherUsers = usersDB.users.filter(
    //   (person) => person.username !== foundUser.username
    // );
    // const currentUser = { ...foundUser, refreshToken };
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
