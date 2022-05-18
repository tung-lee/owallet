import { BACKGROUND_PORT } from '@owallet-wallet/router';
import {
  ExtensionRouter,
  ExtensionGuards,
  ExtensionEnv,
  ContentScriptMessageRequester
} from '@owallet-wallet/router-extension';
import { ExtensionKVStore } from '@owallet-wallet/common';
import { init, ScryptParams } from '@owallet-wallet/background';
import scrypt from 'scrypt-js';
import { Buffer } from 'buffer/';

import { EmbedChainInfos, PrivilegedOrigins } from '../config';

const router = new ExtensionRouter(ExtensionEnv.produceEnv);
router.addGuard(ExtensionGuards.checkOriginIsValid);
router.addGuard(ExtensionGuards.checkMessageIsInternal);

init(
  router,
  (prefix: string) => new ExtensionKVStore(prefix),
  new ContentScriptMessageRequester(),
  EmbedChainInfos,
  PrivilegedOrigins,
  (array) => {
    return Promise.resolve(crypto.getRandomValues(array));
  },
  {
    scrypt: async (text: string, params: ScryptParams) => {
      return await scrypt.scrypt(
        Buffer.from(text),
        Buffer.from(params.salt, 'hex'),
        params.n,
        params.r,
        params.p,
        params.dklen
      );
    }
  },
  {
    create: (params: {
      iconRelativeUrl?: string;
      title: string;
      message: string;
    }) => {
      browser.notifications.create({
        type: 'basic',
        iconUrl: params.iconRelativeUrl
          ? browser.runtime.getURL(params.iconRelativeUrl)
          : undefined,
        title: params.title,
        message: params.message
      });
    }
  }
);

router.listen(BACKGROUND_PORT);
