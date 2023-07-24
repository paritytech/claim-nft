# Claim NFT

Claim NFT app is an dapp built on substrate. The app is built to let users claim their NFTs using the secret code that is generated using ['nfts campaign runner CLI tool'](https://github.com/paritytech/nfts-campaign-runner).
The app will walkthrough the users to either create a new account or use an existing account to claim their NFTs into.

## Running Claim NFT dapp

### Requirements

- [node.js version >=14](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)
- a [substrate node](https://github.com/substrate-developer-hub/substrate-node-template) or network(e.x. polkadot, kusama) for the gift dapp to connect to.

### Installation

The codebase is installed using [git](https://git-scm.com/) and [yarn](https://yarnpkg.com/). This assumes you have installed yarn globally prior to installing it within the subdirectories. For the most recent version and how to install yarn, please refer to [yarn](https://yarnpkg.com/) documentation and installation guides.

```bash
# Clone the repository
git clone https://github.com/paritytech/claim-nft.git
cd claim-nft
yarn install
```

## Usage

You can start the dapp in development mode to connect to a locally running node.

```bash
yarn start
```

You can also build the app in production mode,

```bash
yarn build
```

and host the `build/` folder using any webserver. refer to [vite] (https://vitejs.dev/guide/static-deploy.html) documentations for more info

## Configuration

The dapps configuration is stored in the `src/config` directory, with
`common.json` being loaded first, then the environment-specific json file.

- `development.json` affects the development environment
- `production.json` affects the production environment, triggered in `yarn build` command.

When writing and deploying your own dapp, you might need to configure:

- `PROVIDER_SOCKET` in `src/config/production.json` pointing to your own
  deployed node.
- `DEVELOPMENT_KEYRING` in `src/config/common.json` be set to `false` if you don't want to load the keyrings usual suspects (Alice, Bob, ...) as test accounts.
  See [Keyring](https://polkadot.js.org/api/start/keyring.html).

### Specifying Connecting Node

There are two ways to specify it:

- With `PROVIDER_SOCKET` in `{common, development, production}.json`.
- With `rpc=<ws or wss connection>` query paramter after the URL. This overrides the above setting.

## Reusable Components

### useSubstrate Custom Hook

The custom hook `useSubstrate` provides access to the Polkadot js API and thus the
keyring and the blockchain itself. Specifically it exposes this API.

```js
{
  socket,
  types,
  keyring,
  keyringState,
  api,
  apiError,
  apiState,
  chainInfo,
}
```

- `socket` - The remote provider socket it is connecting to.
- `types` - The custom types used in the connected node.
- `keyring` - A keyring of accounts available to the user.
- `keyringState` - One of `"READY"` or `"ERROR"` states. `keyring` is valid
  only when `keyringState === "READY"`.
- `api` - The remote api to the connected node.
- `apiState` - One of `"CONNECTING"`, `"READY"`, or `"ERROR"` states. `api` is valid
  only when `apiState === "READY"`.
- `apiError` - the api error if any has happened during connecting to the chain Api
- `chainInfo` - the chain information that are configured for the network including _chainDecimals_, _chainTokens_, _genesisHash_, _chainSS58_ address type and _existentialDeposit_
