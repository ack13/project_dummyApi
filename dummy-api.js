// Import required modules
const express = require("express");
const bodyParser = require("body-parser");

// Create an Express app
const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(data);
});

// Transformation function
function transformData(input) {
  return input.map((item) => {
    const [phoneNumber, key1, key2, key3] =
      item["phoneNumber,key1,key2,key3"].split(",");

    return {
      phoneNumber: phoneNumber,
      variables: {
        key1: key1,
        key2: key2,
        key3: key3,
      },
    };
  });
}

// Define the POST endpoint for /call-trigger
app.post("/call-trigger", (req, res) => {
  const data = transformData(req.body);
  console.log(data)
  return res.status(200).json(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Dummy API listening at http://localhost:${port}`);
});
