const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args) => {
	if(!args[0]) return message.channel.send('Bir ID yazmalısın.')
  if(!client.users.has(args[0])) return message.channel.send('Geçersiz ID.')
  if(!client.users.get(args[0]).bot) return message.channel.send('Bu kişi bir bot değil.')
  
	if (db.has('botlar')) {
			if (Object.keys(db.fetch('botlar')).includes(args[0]) === false)  return message.reply("ID'ini yazdığın bot sistemde yok.")
	}
  
  if (db.has('botlar')) {
  if (db.has(`botlar.${args[0]}.sertifika`) === false) return message.reply("Bu ID'e sahip bot da zaten sertifika yok.")
  }
  
  message.channel.send(`Başarıyla \`${args[0]}\` ID'ine sahip \`${db.fetch(`botlar.${args[0]}.isim`)}\` adlı bota sertifika verildi.`)
  client.channels.get(client.ayarlar.kayıt).send(`\`${message.author.tag}\` adlı yetkili tarafından \`${db.fetch(`botlar.${args[0]}.sahip`)}\` adlı kullanıcının \`${args[0]}\` ID'ine sahip \`${db.fetch(`botlar.${args[0]}.isim`)}\` adlı bota sertifika verildi.`)
	
  db.delete(`botlar.${args[0]}.sertifika`)
  
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['sertifika-sil'],
	permLevel: 'ozel',
	kategori: 'yetkili'
}

exports.help = {
	name: 'sertifika-al',
	description: 'Yazılan ID\'deki botu sertifikalı yapar.',
	usage: 'sertifika-ekle [ID]'
}