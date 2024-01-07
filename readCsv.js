const express = require("express");
const multer = require("multer");
const axios = require("axios");
const Papa = require("papaparse");
const app = express();
const port = 3001;
const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/upload", upload.single("csvFile"), async (req, res) => {
  try {
    const csvData = require("fs").readFileSync(req.file.path, "utf8");
    console.log(csvData)
    let parsedData;
    Papa.parse(csvData, {
      delimiter: "\t",
      header: true,
      complete: function (results) {
        parsedData = results.data;
      },
      error: function (error) {
        console.error(error.message);
      },
    });

    const isValid = convertToApiInput(csvData);
    if (!isValid) {
      res.status(400).send("Invalid CSV format for the dummy API");
      return;
    }

    // Send data to the dummy API
    if (isValid) {
      const axiosOptions = {
        method: "POST",
        url: "http://localhost:3000/call-trigger",
        data: parsedData,
      };
      const response = await axios(axiosOptions);
      res
        .status(200)
        .send(
          "Data uploaded successfully. Response from Dummy API: " +
            JSON.stringify(parsedData)
        );
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server Error");
  }
});

const validateHeaders = (actualHeaders, expectedHeaders) => {
  if (actualHeaders.length !== expectedHeaders.length) {
    console.error("Invalid number of headers");
    return false;
  }

  const isValid = expectedHeaders.every((expectedHeader, index) => {
    return actualHeaders[index].trim() === expectedHeader.trim();
  });

  if (!isValid) {
    console.error("Invalid headers:", actualHeaders);
  }
  return isValid;
};

function convertToApiInput(data) {
    const validHeaders = ["phoneNumber", "key1", "key2", "key3"];
    
    const rows = data
    .split("\n") // Split the CSV data into rows
    .map((row) => row.split(",")); // Split each row into columns
    
    console.log(rows)
    const isValid = rows.every((row, index) => {
       
            return validateHeaders(row, validHeaders);
        
       
    });
    return isValid;
}

// Start the server
app.listen(port, () => {
  console.log(`Web application listening at http://localhost:${port}`);
});
