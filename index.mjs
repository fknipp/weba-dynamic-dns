import express from "express";
import path from "path";

import {
  getDomainRecords,
  addOrUpdateDomainName,
  deleteAllDomainRecords,
} from "./hetzner-api.mjs";

import { DOMAIN } from "./configuration.mjs";

const app = express();

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("pages/index.html"));
});

app.get("/api/test/:id", (req, res) => {
  console.log(req.params);
  console.log(req.ip);
  const ip = req.headers["x-forwarded-for"].split(",")[0];
  res.send(ip);
});

app.get("/api/dnsname/:name", async (req, res) => {
  const name = req.params.name;
  const ip = req.headers["x-forwarded-for"].split(",")[0];
  const response = await addOrUpdateDomainName(name, ip);
  const { name: dnsName, value } = response.record;
  res
    .type("text/plain")
    .send(`DNS record created for ${ip} on ${dnsName}.${DOMAIN}.\n`);
});

app.get("/api/dnsname", async (req, res) => {
  const response = await getDomainRecords();
  res.json(response);
});

app.delete("/api/dnsname", async (req, res) => {
  const response = await deleteAllDomainRecords();
  res.json(response);
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
