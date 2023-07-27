const getClaimedNftsAsset = async (api, classId, instanceId) => {
  const asset = {
    classId,
    instanceId,
  };
  try {
    if (classId && instanceId) {
      let [classMeta, instanceMeta] = await Promise.all([
        api.query.nfts.collectionMetadataOf(classId),
        api.query.nfts.itemMetadataOf(classId, instanceId),
      ]);

      classMeta = classMeta?.unwrapOrDefault()?.toHuman();
      instanceMeta = instanceMeta.unwrapOrDefault()?.toHuman();

      asset.classMetadata = classMeta?.data;
      asset.instanceMetadata = instanceMeta?.data;
    }
  } catch (err) {
    console.log(`error reading nfts metadata ${err}`);
  }
  return asset;
};

export const getClaimedAssets = async (api, events) => {
  const claimed = { nfts: [], balances: [], assets: [] };
  for (const { event } of events) {
    if (api.events.balances && api.events.balances.Transfer.is(event)) {
      // parse claimed balances
      const claimedBalance = event?.data[2]?.toString();
      claimedBalance && claimed.balances.push(claimedBalance);
    } else if (api.events.nfts && api.events.nfts.Transferred.is(event)) {
      // parse claimed nfts
      const classId = event?.data[0]?.toString();
      const instanceId = event?.data[1]?.toString();
      const claimedAsset = await getClaimedNftsAsset(
        api,
        classId,
        instanceId
      );
      claimedAsset && claimed.nfts.push(claimedAsset);
    }
  }
  return claimed;
};
