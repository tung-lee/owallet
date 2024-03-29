/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */

import 'zx/globals';
import fs from 'fs';
import FolderHash from 'folder-hash';

async function calculateOutputHash(root) {
  const dirCandidates = fs.readdirSync(root, {
    withFileTypes: true
  });

  let dirs = [];

  for (const candidate of dirCandidates) {
    if (candidate.isDirectory()) {
      if (candidate.name !== 'node_modules' && candidate.name !== 'proto-types-gen') {
        dirs.push(candidate);
      }
    }
  }

  dirs = dirs.sort((dir1, dir2) => {
    if (dir1.name < dir2.name) return -1;
    if (dir1.name > dir2.name) return 1;
    return 0;
  });

  let hash = Buffer.alloc(0);
  for (const dir of dirs) {
    const p = path.join(root, dir.name);
    const buf = Buffer.from((await FolderHash.hashElement(p)).hash, 'base64');

    

    hash = Buffer.concat([hash, buf]);
  }

  return hash.toString('base64');
}

(async () => {
  try {
    const packageRoot = path.join(__dirname, '../..');

    const outDir = path.join(__dirname, '../src');
    $.verbose = false;

    if (fs.existsSync(outDir)) {
      fs.rmdirSync(outDir, { recursive: true });
    }

    await $`mkdir -p ${outDir}`;
    $.verbose = true;

    const protoTsBinPath = (() => {
      try {
        const binPath = path.join(__dirname, '../../node_modules/.bin/protoc-gen-ts_proto');
        fs.readFileSync(binPath);
        return binPath;
      } catch {
        const binPath = path.join(__dirname, '../../../../node_modules/.bin/protoc-gen-ts_proto');
        fs.readFileSync(binPath);
        return binPath;
      }
    })();

    const baseDirPath = path.join(__dirname, '..');

    const baseProtoPath = path.join(baseDirPath, 'proto');
    const thirdPartyProtoPath = path.join(baseDirPath, 'third_party/proto');

    const inputs = [
      'agoric/swingset/msgs.proto',
      'cosmos/authz/v1beta1/tx.proto',
      'cosmos/base/v1beta1/coin.proto',
      'cosmos/bank/v1beta1/bank.proto',
      'cosmos/bank/v1beta1/tx.proto',
      'cosmos/bank/v1beta1/authz.proto',
      'cosmos/staking/v1beta1/tx.proto',
      'cosmos/staking/v1beta1/authz.proto',
      'cosmos/gov/v1beta1/gov.proto',
      'cosmos/gov/v1beta1/tx.proto',
      'cosmos/distribution/v1beta1/tx.proto',
      'cosmos/crypto/multisig/v1beta1/multisig.proto',
      'cosmos/crypto/secp256k1/keys.proto',
      'cosmos/tx/v1beta1/tx.proto',
      'cosmos/tx/signing/v1beta1/signing.proto',
      'cosmos/base/abci/v1beta1/abci.proto',
      'cosmwasm/wasm/v1/tx.proto',
      'ibc/applications/transfer/v1/tx.proto',
      'secret/compute/v1beta1/msg.proto',
      'ethermint/types/v1/web3.proto'
    ];

    const thirdPartyInputs = ['tendermint/crypto/keys.proto'];

    await $`protoc \
      --plugin=${protoTsBinPath} \
      --ts_proto_opt=forceLong=string \
      --ts_proto_opt=esModuleInterop=true \
      --ts_proto_opt=outputClientImpl=false \
      --proto_path=${baseProtoPath} \
      --proto_path=${thirdPartyProtoPath} \
      --ts_proto_out=${outDir} \
      ${inputs.map((i) => path.join(baseProtoPath, i))} \
      ${thirdPartyInputs.map((i) => path.join(thirdPartyProtoPath, i))}`;

    $.verbose = false;

    // Move tsconfig.json to package root
    await $`cp ${packageRoot}/proto-types-gen/tsconfig.json ${packageRoot}/tsconfig.json`;

    // Build javascript output
    cd(packageRoot);
    await $`npx tsc`;

    // Remove used tsconfig.json
    await $`rm ${packageRoot}/tsconfig.json`;

    $.verbose = true;
  } catch (e) {
    console.log('🚀 ~ file: proto-gen.mjs:146 ~ e:', e);
    process.exit(1);
  }
})();

/* eslint-enable import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
