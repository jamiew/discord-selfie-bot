yet another gliffy discord bot

template install command - use your own `client_id=`:

<https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands>

requires

- nodejs 18
- [pnpm](https://pnpm.io/)

## Setup/Bot Registration

1. Register a new bot on Discord Developer Portal. `DISCORD_APPLICATION_ID` is on the main page; this Application ID is also sometimes called a Client ID. Then go the "Bot" page and click "Reset Token" to get `DISCORD_BOT_TOKEN`.

Copy .env.example to .env and fill in the values

Lastly, install the bot to your server by adding YOUR_APPLICATION_ID to a URL like:

<https://discord.com/api/oauth2/authorize?client_id=[YOUR_APPLICATION_ID]&scope=bot%20applications.commands&permissions=0>

This will install bot user who can add slash commands, but not read or post normal messages or do anything else.

To get read/write message permissions, you'll need to enable the various Privileged Gateway Intents in your bot's configuration on the Discord Developer Portal, and then add a permissions mask like so:

<https://discord.com/api/oauth2/authorize?client_id=[YOUR_APPLICATION_ID]&scope=bot%20applications.commands&permissions=3072>

## Running

Install dependencies

```sh
pnpm install
```

To run in development mode, reloading on code changes:

```sh
pnpm dev
```

To run in production mode:

```sh
pnpm build
pnpm start
```
