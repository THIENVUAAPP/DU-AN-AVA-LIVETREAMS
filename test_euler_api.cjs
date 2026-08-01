const { createEulerClient, SignConfig } = require('tiktok-live-connector');

async function test() {
  SignConfig.apiKey = "euler_ZmE5ODQzZmM0MzZlMDNlODBkNWEzNTUwZGFhZjQxMjNmN2RjMTA3ZjU2YWE0ZGNlOGU2MTQ1";
  const apiClient = createEulerClient();
  console.log("rooms methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(apiClient.rooms)));
  console.log("webcast methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(apiClient.webcast)));
}
test();
