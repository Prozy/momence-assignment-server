import express, { Express, Request, Response } from "express";
// import cors from "cors";
const cors = require("cors");

const app: Express = express();
const port = 3001;

app.use(
  cors({
    origin: "*", // Allows any origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow credentials such as cookies
    optionsSuccessStatus: 204, // Respond with a 204 status code for preflight requests
  })
);

const parseData = (data: string) => {
  const dataRows = data.split("\n");
  const metaDataArray = (dataRows.shift() || "").split(" ");
  const metaData = {
    day: metaDataArray[0],
    month: metaDataArray[1],
    year: metaDataArray[2],
    order: metaDataArray[3],
  };
  const headersArray = (dataRows.shift() || "").split("|");
  const dataArray = dataRows.map((row: string) => {
    const rowDataArray = row.split("|");

    return {
      country: rowDataArray[0],
      currency: rowDataArray[1],
      amount: rowDataArray[2],
      code: rowDataArray[3],
      rate: rowDataArray[4],
    };
  });
  dataArray.pop();

  const responseObject = {
    meta: metaData,
    headers: headersArray,
    data: dataArray,
  };

  return responseObject;
};

app.get("/cnb-data", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
    );
    const data = await response.text();

    res.json(parseData(data));
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
