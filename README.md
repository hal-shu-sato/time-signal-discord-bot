# Time signal for Discord

Time signal for Discord notices time every hour, using audio and text.

# Requirement

- Node.js 12.13.0
- pnpm 11.22.0
- discord.js 12.2.0
  - @discordjs/opus 0.3.2
- ffmpeg-static 4.2.1
- node-cron 2.0.3
- log4js 6.2.1

# Installation

```bash
git clone https://github.com/hal-shu-sato/time-signal-discord-bot
cd time-signal-discord-bot
pnpm install
```

# Usage

## Batch (The easiest way)

Run "start.bat"

## Bash

```bash
cd time-signal-discord-bot
pnpm run start
```

# Note

I don't test on Mac and Linux.

# Author

- [ato lash](https://github.com/hal-shu-sato)
- Homepage: http://halshusato.starfree.jp/
- Twitter: https://twitter.com/hal_shu_sato

# Credit

The audio notification uses sound file from [OtoLogic](https://otologic.jp). ([CC BY 4.0](https://github.com/hal-shu-sato/time-signal-discord-bot/blob/master/audio/LICENSE))

# License

"Time signal for Discord" is under [MIT license](https://github.com/hal-shu-sato/time-signal-discord-bot/blob/master/LICENSE).
