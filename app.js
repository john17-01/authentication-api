const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const databasePath = path.join(__dirname, "userData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeEngine = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(5000, () => {
      console.log("Engine Launched");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeEngine();

//API 1
app.post("/register", async (request, response) => {
  const { userName, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const databaseUser = await database.get(selectUserQuery);

  if (databaseUser === undefined) {
    const createUserQuery = `
     INSERT INTO
      user (username, name, password, gender, location)
     VALUES
      (
       '${userName}',
       '${name}',
       '${hashedPassword}',
       '${gender}',
       '${location}'  
      );`;
    if (password.length > 4) {
      await database.run(createUserQuery);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});
