// Imports
const gradient = require('gradient-string');
const setTitle = require('node-bash-title');
const colors = require('colors');
const ps = require("prompt-sync");
const prompt = ps({ sigint: true })
const Discord = require('discord.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const fs = require("node:fs/promises");

// The Keywords list
const keywordRegexes = [
  [ 'content', 'Content:' ],
  [ 'username', 'Username:' ], 
  [ 'avatarURL', 'Pfp:' ], 
].reduce(
  (map, [ prop, keyword ]) => map.set(prop, new RegExp(`${keyword} (.+)\ /Suffix`, "g")), // /Suffix must appear at end of Content, Username, and Pfp
  new Map()
);

// Interface
console.clear()
setTitle('Discord Server Cloner');
console.log(colors.bold(gradient.vice.multiline("Discord Webhook Server Cloner!")).underline + '\n');
console.log(colors.bold("Syntax for file".underline.white))
console.log("Content: Some content to use! /Suffix".white)
console.log("Username: DiscordUsername /Suffix".white)
console.log("Pfp: A Url /Suffix".white)
console.log("")
console.log(colors.bold("Limitations".underline.white))
console.log("Messages over 2000 characters will need to be changed.".brightRed)
console.log("Usernames over 80 characters will need to be changed.".brightRed)
console.log("")
let FileToClone = prompt("Enter file to output: ".brightBlue)
let WebhookUrl = prompt("Enter Webhook URL... : ".brightBlue)
console.log("")

// Webook creation
let WH = new WebhookClient({ 
    url: WebhookUrl
})

// Searches through file for keywords
let i = 1;
let line = 0;
(async () => {
  const files = [
    await fs.readFile(FileToClone, 'utf8')
  ];
  for (const file of files) {
    currentFileLoop:
    for (;;) {
      const hookObj = {};
      for (const [ prop, re ] of keywordRegexes) {
        const result = re.exec(file);
        if (result === null)
          break currentFileLoop;
          line = line + 1
        hookObj[prop] = result[1];
      }
      console.log(gradient.cristal.multiline("On line "+ line +" sent WebHook number "+ i +"!"))
      i = i + 1
      await WH.send(hookObj);
    }
  }
  })().catch(console.error);
