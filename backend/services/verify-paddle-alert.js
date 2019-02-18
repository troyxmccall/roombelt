const crypto = require("crypto");
const Serialize = require("php-serialize");

const config = require("../config");

function ksort(obj) {
  const keys = Object.keys(obj).sort();
  const result = {};

  for (var i in keys) {
    result[keys[i]] = obj[keys[i]];
  }

  return result;
}

module.exports = function(payload) {
  const signature = Buffer.from(payload.p_signature, "base64");

  delete payload.p_signature;

  // Need to serialize array and assign to data object
  payload = ksort(payload);
  for (const property in payload) {
    if (payload.hasOwnProperty(property) && (typeof payload[property]) !== "string") {
      if (Array.isArray(payload[property])) { // is it an array
        payload[property] = payload[property].toString();
      } else { //if its not an array and not a string, then it is a JSON obj
        payload[property] = JSON.stringify(payload[property]);
      }
    }
  }

  const serialized = Serialize.serialize(payload);

  // End serialize data object
  const verifier = crypto.createVerify("sha1");
  verifier.update(serialized);
  verifier.end();

  return verifier.verify(`-----BEGIN PUBLIC KEY-----\n${config.paddlePublicKey}\n-----END PUBLIC KEY-----`, signature);
};