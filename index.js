const crypto = require('crypto-js');
const requestLib = require('request');

const apiKey = '__API_KEY__';
const apiSecret = '__API_SECRET__';
const apiUrl = 'https://api.crypto.com/v2/';
const method = 'private/get-order-detail';

const signRequest = request => {
  const { id, method, params, nonce } = request;

  const paramsString =
    params === null
      ? ''
      : Object.keys(params)
          .sort()
          .reduce((a, b) => {
            return a + b + params[b];
          }, '');

  const sigPayload = method + id + apiKey + paramsString + nonce;

  request.sig = crypto.HmacSHA256(sigPayload, apiSecret).toString(crypto.enc.Hex);

  return request;
};

let request = {
  id: 11,
  method: method,
  api_key: apiKey,
  params: {
    order_id: 53287421324
  },
  nonce: Date.now()
};
const requestBody = JSON.stringify(signRequest(request));

console.log(requestBody); // {"id":11,"method":"private/get-order-detail","api_key":"__API_KEY__","params":{"order_id":53287421324},"nonce":1592765134248,"sig":"__SIGNATURE__"}

requestLib.post(apiUrl + method, requestBody, function (err, response) {
  console.log(response.statusCode); // 500
  console.log(response.body); // {"code":"100001","msg":"SYS_ERROR"}
});
