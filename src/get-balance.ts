import * as path from 'node:path';
import 'dotenv/config'
import * as NearApi from "near-api-js";
import * as BN from 'bn.js';

const createKeystore = (path: string) => {
  const { KeyPair, keyStores } = require("near-api-js");
  const fs = require("fs");
  const homedir = require("os").homedir();

  const NETWORK_ID = "testnet";
  const credentials = JSON.parse(fs.readFileSync(path));

  const keyStore = new keyStores.InMemoryKeyStore();
  keyStore.setKey(
    NETWORK_ID,
    credentials.account_id,
    KeyPair.fromString(credentials.private_key)
  );
  return keyStore;
}

const credentialsPath =
  path.join(process.env.CREDENTIALS_FOLDER, process.env.ACCOUNT_ID + '.json');
const config: NearApi.ConnectConfig = {
  networkId: "testnet",
  keyStore: createKeystore(credentialsPath),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  // explorerUrl: "https://explorer.testnet.near.org",
  headers: null
};

(async () => {
  const near = await NearApi.connect(config);
  const account = await near.account(process.env.ACCOUNT_ID);
  const accountBalance = await account.getAccountBalance();
  console.log('Available balance: '
    + NearApi.utils.format.formatNearAmount(accountBalance.available));
  const availableBalance =
    new BN(accountBalance.total).sub(new BN(accountBalance.stateStaked));
  console.log(
    'Available balance: '
    + NearApi.utils.format.formatNearAmount(availableBalance.toString())
  );
})();
