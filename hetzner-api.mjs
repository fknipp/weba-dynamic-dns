import fetch from "node-fetch";

import {
  HETZNER_DNS_API_KEY,
  HETZNER_DNS_API_ROOT,
  ZONE_ID,
  NAME_SUFFIX,
} from "./configuration.mjs";

async function callHetznerDnsApi(path, method = "GET", data = {}) {
  const response = await fetch(`${HETZNER_DNS_API_ROOT}${path}`, {
    method,
    body: ["POST", "PUT"].includes(method) ? JSON.stringify(data) : undefined,
    headers: {
      "Auth-API-Token": HETZNER_DNS_API_KEY,
    },
  });
  return await response.json();
}

export async function getDomainRecords() {
  const data = await callHetznerDnsApi(
    `/records?zone_id=${encodeURIComponent(ZONE_ID)}`
  );
  const recordsWithNameSuffix = data.records.filter(({ name, type }) =>
    name.endsWith(NAME_SUFFIX) && type === 'A'
  );

  return recordsWithNameSuffix;
}

export async function addOrUpdateDomainName(name, ip) {
  const records = await getDomainRecords();
  const fullName = `${name}${NAME_SUFFIX}`;
  const found = records.find((r) => r.name === fullName);

  const record = {
    value: ip,
    ttl: 600,
    type: "A",
    name: fullName,
    zone_id: ZONE_ID,
  };

  console.log(found);
  
  if (found) {
    return await callHetznerDnsApi(`/records/${found.id}`, "PUT", record);
  } else {
    return await callHetznerDnsApi("/records", "POST", record);
  }
}

export async function deleteAllDomainRecords() {
  const records = await getDomainRecords();
  for (let record of records) {
    await callHetznerDnsApi(`/records/${record.id}`, "DELETE");
  }
}
