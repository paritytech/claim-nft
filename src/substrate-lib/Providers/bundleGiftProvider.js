import BN from 'bn.js';
import utils from '../substrateUtils';
import { signAndSendTx, getClaimedAssets } from './txHandler';
import config from '../../config';
import { transferBalanceAndFees, transferAllAssets } from './txCalls';
const feeMultiplierValue = config.ADDED_FEE_MULTIPLIER;

const uniquesPalletGiftProvider = {
  createGift: async (api, interimAccount, senderAccount, gift) => {
    // currently create only supports balances
    const interimAddress = utils.getAccountAddress(interimAccount);
    return transferBalanceAndFees(
      api,
      senderAccount,
      interimAddress,
      gift?.amount,
      feeMultiplierValue, // fee multiplier of 1x
      'gift::create'
    );
  },
  claimGift: async (api, interimAccount, recipientAccount) => {
    const recepientAddress = utils.getAccountAddress(recipientAccount);

    // NFT-Campaign only:  if there is no NFTs to claim throw an error
    // verify the gift account holds any uniques assets.
    const fromAddress = utils.getAccountAddress(interimAccount);
    const assetKeys = await api.query.uniques?.account.keys(fromAddress);
    if ((assetKeys?.length || 0) === 0) {
      throw new Error('The entered gift secret does not hold any NFTs. You might have entered the wrong secret or the NFT might have been already claimed.');
    }

    const events = await transferAllAssets(
      api,
      interimAccount,
      recepientAddress,
      'gift::claim'
    );
    const claimed = getClaimedAssets(api, events);
    return claimed;
  },
  removeGift: (api, interimAccount, senderAccount) => {
    const senderAddress = utils.getAccountAddress(senderAccount);
    return transferAllAssets(api, interimAccount, senderAddress, 'gift::remove');
  },
  getGiftFeeMultiplier: () => {
    // gift creation fees are multiplied by this multiplier and added to the gift value when the gift is generated.
    // the gift value is calculated as : gift_amount + feeMultiplierValue*(txfee)
    // The added fee amount will cover the fees for the tranaction from the interim gif account to the recipient account during claim process
    // , plus  maybe some more transactions after the claim that are covered.
    return feeMultiplierValue;
  }
};

export default uniquesPalletGiftProvider;
