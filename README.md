# music-bot

A bot that can play music! It's as simple as it sounds.

### Config

If you are self-hosting this bot, you need to do some configuration:

- You will need to have a YTDLP binary installed for this to work, you can get one [here](https://github.com/yt-dlp/yt-dlp/releases).
- Once you configure (below), you can run `/deploy` to deploy all of the slash commands to the bot.

```JSON
{
    "token": "Your discord bot token",
    "development": {
        "application_id": "Your application ID",
        "guild_id": "Your guild"
    },
    "youtube": {
        "api_key": "Youtube API key",
        "binary_path": "Absolute path to YTDLP"
    }
}
```

### Extra features

This bot can also:

- Generate memes with the `/meme` command
- Oobinate (change all vowels of a word to oob) with the `/oob` command
- More dumb stuff I will later