import config from "../config";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateHash(length = 16) {
  let result = "";

  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export async function getRandomOrgHash(length = 16) {
  const url = "https://api.random.org/json-rpc/4/invoke";
  const body = { apiKey: config.RANDOMORG_APIKEY, n: 1, length, characters };
  const response = await axios(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: JSON.stringify({
      jsonrpc: "2.0",
      id: uuidv4(),
      method: "generateStrings",
      params: body,
    }),
  });

  return response.data.result.random.data[0];
}

export async function getHeadEOSBlockId() {
  try {
    const URL = config.RPC_URL;
    const params = "/v1/chain/get_info";
    const data = (await axios.get(URL + params)).data;
    return data.head_block_id;
  } catch (e) {
    return null;
  }
}

export async function getHeadEOSBlockNumber() {
  try {
    const URL = config.RPC_URL;
    const params = "/v1/chain/get_info";
    const data = (await axios.get(URL + params)).data;
    return data.head_block_num;
  } catch (e) {
    return null;
  }
}

export async function getEOSBlockId(blockNum: number) {
  try {
    const URL = config.RPC_URL;
    const params = "/v1/chain/get_block";
    const data = (
      await axios.post(URL + params, {
        block_num_or_id: String(blockNum),
      })
    ).data;
    return data.id;
  } catch (e) {
    return null;
  }
}
