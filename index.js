const Discord = require('discord.js');
const client = new Discord.Client();
const chalk = require('chalk');
const fs = require('fs');
const db = require('quick.db');
const useful = require('useful-tools');
client.ayar = db;

client.htmll = require('cheerio');
client.useful = useful;
client.tags = require('html-tags');


client.ayarlar = {
  "prefix": "!!",
  "oauthSecret": "", //bot outh secret
	"callbackURL":  "url/callback", // örnek: https//www.serendiasquad.xyz/callback
	"kayıt": "",
  "rapor": "",
  "renk": ""         //gerekli yerleri doldurun.
};



client.yetkililer = [""] //genel tüm yetkilileriniz
client.webyetkililer = [""]  //web yetkilileri
client.sunucuyetkililer = [""] //sunucu yetkilileri


client.on('ready', async () => {
  client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);
  require("./app.js")(client);
  client.user.setActivity(``, { type:"PLAYING" })
  console.log(`Alosha ❤️ Piece ❤️ Kasuperu Sama | Serendia Squad`)
});

setInterval(() => {
  if (db.has('botlar') && db.has('kbotlar')) {
    for (var i = 0; i < Object.keys(db.fetch('kbotlar')).length; i++) {
      for (var x = 0; x < Object.keys(db.fetch('botlar')).length; x++) {
        var bot = Object.keys(db.fetch('botlar'))[x]
        var user = Object.keys(db.fetch('kbotlar'))[i]
        if (db.has(`oylar.${bot}.${user}`)) {
          setTimeout(() => {
            db.delete(`oylar.${bot}.${user}`)
          }, require('ms')(`${client.useful.seg(db.fetch(`oylar.${bot}.${user}`), 6)}h`));
        }
      }
    }
  }
}, 10000);

client.on("message", async message => {

	if (message.author.bot) return
	if (!message.content.startsWith(client.ayarlar.prefix)) return
	var command = message.content.split(' ')[0].slice(client.ayarlar.prefix.length)
	var args = message.content.split(' ').slice(1)
	var cmd;

	if (client.commands.has(command)) cmd = client.commands.get(command)
  if (client.aliases.has(command)) cmd = client.commands.get(client.aliases.get(command))

	if (cmd) {
    if (cmd.conf.permLevel === 'ozel') 
      if (client.yetkililer.includes(message.author.id) === false) return message.channel.send("Yetersiz yetki.")
    }
		if (cmd.conf.permLevel === 1) {
			if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Yetersiz yetki.")
		}
		if (cmd.conf.permLevel === 2) {
			if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Yetersiz yetki.")
		}
		if (cmd.conf.permLevel === 3) {
			if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Yetersiz yetki.")
		}
		if (cmd.conf.permLevel === 4) {
			const x = await client.fetchApplication()
      var arr = client.yetkililer
			if (!arr.includes(message.author.id)) return message.channel.send("Yetersiz yetki.")
		}
		if (cmd.conf.enabled === false) {
			message.channel.send("Bu komut devre dışı.")
		}
		if (message.channel.type === "dm") {
				message.channel.send("Bu komutu özel mesajlarda kullanamazsın.")
		}
		cmd.run(client, message, args)
});

client.on('guildMemberAdd' , async member => {           //bu kısım sunucuya eklenen botlara otomatik bot rolünü verir.
  if(!member.user.bot) return;
  await member.addRole("");  //bot rol id
  var kanal = member.guild.channels.get(client.ayarlar.otobotlogid);
  kanal.send(`**Sunucuya ${member} adlı bot katıldı <@&${client.ayarlar.otobotrolid}> adlı rol verildi !**`)
  
});


client.login("muhteşem gizli tokenin :O").catch(console.error)
process.env = {}
process.env.TOKEN = "muhteşem gizli tokenin :O";   
