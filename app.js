const request = require('request');
const db = require('quick.db');
const fs = require('fs');
const url = require("url");
const path = require("path");                      //serendia squad <3
const Discord = require("discord.js");
var express = require('express');
var app = express();
const moment = require("moment");
require("moment-duration-format");
const passport = require("passport");
const session = require("express-session");
const LevelStore = require("level-session-store")(session);
const Strategy = require("passport-discord").Strategy;
const helmet = require("helmet");
const md = require("marked");

module.exports = (client) => {
  
const templateDir = path.resolve(`${process.cwd()}${path.sep}html`);
app.use("/css", express.static(path.resolve(`${templateDir}${path.sep}css`)));

passport.serializeUser((user, done) => {
done(null, user);
});
passport.deserializeUser((obj, done) => {
done(null, obj);
});

passport.use(new Strategy({
clientID: client.user.id,
clientSecret: client.ayarlar.oauthSecret,
callbackURL: client.ayarlar.callbackURL,
scope: ["identify"]
},
(accessToken, refreshToken, profile, done) => {
process.nextTick(() => done(null, profile));
}));

app.use(session({
secret: '123',
resave: false,
saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.locals.domain = process.env.PROJECT_DOMAIN;

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
extended: true
})); 

function checkAuth(req, res, next) {
if (req.isAuthenticated()) return next();
req.session.backURL = req.url;
res.redirect("/giris");
}

const renderTemplate = (res, req, template, data = {}) => {
const baseData = {
bot: client,
path: req.path,
user: req.isAuthenticated() ? req.user : null
};
res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};

  app.get("/yetkili/hata", (req, res) => {renderTemplate(res, req, "izinsizgiris.ejs")})

app.get("/yetkili", checkAuth, (req, res) => {

  
 if(!client.yetkililer == req.user.id ) return res.redirect('/yetkili/hata')
   
  
renderTemplate(res, req, "y-panel.ejs") 
});
  
  app.get("/yetkili-bekle", checkAuth, (req, res) => {

  
 if(!client.yetkililer.includes(req.user.id) === true ) return res.redirect('/yetkili/hata')
   
  
renderTemplate(res, req, "d-panel-bekle.ejs") 
});
  
    app.get("/yetkili-onay", checkAuth, (req, res) => {

  
 if(!client.yetkililer.includes(req.user.id) === true ) return res.redirect('/yetkili/hata')
   
  
renderTemplate(res, req, "d-panel-onay.ejs") 
});
  
    
    app.get("/yetkili-red", checkAuth, (req, res) => {

  
 if(!client.yetkililer.includes(req.user.id) === true ) return res.redirect('/yetkili/hata')
   
  
renderTemplate(res, req, "d-panel-red.ejs") 
});
  
      app.get("/yetkili-ser", checkAuth, (req, res) => {

  
 if(!client.yetkililer.includes(req.user.id) === true ) return res.redirect('/yetkili/hata')
   
  
renderTemplate(res, req, "d-panel-ser.ejs") 
});
  

  
      

  
  


  
  


app.get("/giris", (req, res, next) => {
if (req.session.backURL) {
req.session.backURL = req.session.backURL;
} else if (req.headers.referer) {
const parsed = url.parse(req.headers.referer);
if (parsed.hostname === app.locals.domain) {
req.session.backURL = parsed.path;
}
} else {
req.session.backURL = "/";
}
next();
},
passport.authenticate("discord"));

app.get("/baglanti-hatası", (req, res) => {
renderTemplate(res, req, "autherror.ejs");
});

app.get("/callback", passport.authenticate("discord", { failureRedirect: "/autherror" }), async (req, res) => {
if (req.session.backURL) {
const url = req.session.backURL;
req.session.backURL = null;
res.redirect(url);
} else {
res.redirect("/");
}
});

app.get("/cikis", function(req, res) {
req.session.destroy(() => {
req.logout();
res.redirect("/");
});
});

app.get("/", (req, res) => {
renderTemplate(res, req, "index.ejs");
});

app.get("/sertifika", (req, res) => {

renderTemplate (res, req, "sertifika.ejs");
});
app.get("/sertifikabasvuru", (req, res) => {

renderTemplate (res, req, "verification.ejs");
});
app.get("/hakkimizda", (req, res) => {
  
renderTemplate(res, req, "hakkımızda.ejs");
});

app.get("/botlar", (req, res) => {
 
renderTemplate(res, req, "botlar.ejs")
});
app.get("/verifications/:userID", checkAuth, (req, res) => {

  request({
    url: `https://discordapp.com/api/v7/users/${req.params.userID}`,
    headers: {
      "Authorization": `Bot ${process.env.TOKEN}`
    },
  }, function(error, response, body) {
    if (error) return console.log(error)
    else if (!error) {
      var kisi = JSON.parse(body)

      renderTemplate(res, req, "verifications.ejs", {kisi})
    };
  });

});

app.get("/etiketler", (req, res) => {
 
renderTemplate(res, req, "etiketler.ejs")
});
app.get("/etiketler/moderasyon", (req, res) => {
 
renderTemplate(res, req, "etiketler/Moderasyon.ejs")
});

app.get("/etiketler/muzik", (req, res) => {
 
renderTemplate(res, req, "etiketler/Müzik.ejs")
});

app.get("/etiketler/anime", (req, res) => {
 
renderTemplate(res, req, "etiketler/Anime.ejs")
});
app.get("/etiketler/ayarlanabilir", (req, res) => {
 
renderTemplate(res, req, "etiketler/Ayarlanabilir.ejs")
});
app.get("/etiketler/ayarlar", (req, res) => {
 
renderTemplate(res, req, "etiketler/Ayarlar.ejs")
});
app.get("/etiketler/seviye", (req, res) => {
 
renderTemplate(res, req, "etiketler/Seviye.ejs")
});
app.get("/etiketler/ekonomi", (req, res) => {
 
renderTemplate(res, req, "etiketler/Ekonomi.ejs")
});
app.get("/etiketler/eglence", (req, res) => {
 
renderTemplate(res, req, "etiketler/Eğlence.ejs")
});
app.get("/etiketler/oyun", (req, res) => {
 
renderTemplate(res, req, "etiketler/Oyun.ejs")
});
app.get("/etiketler/roleplay", (req, res) => {
 
renderTemplate(res, req, "etiketler/Roleplay.ejs")
});
app.get("/etiketler/web-panel", (req, res) => {
 
renderTemplate(res, req, "etiketler/Web-Panel.ejs")
});
   app.get("/verification", checkAuth, (req, res) => { // BOT SAYFASI
 
  request({
    url: `https://discordapp.com/api/v7/users/${req.params.userID}`,
    headers: {
      "Authorization": `Bot ${process.env.TOKEN}`
    },
  }, function(error, response, body) {
    if (error) return console.log(error)
    else if (!error) {
      var kisi = JSON.parse(body)

      renderTemplate(res, req, "verification.ejs", {kisi})
    };
  });
});
  


 app.get("/sertifika/onayla/:botID", checkAuth, (req, res) => {

var id = req.params.botID
 var sahip = db.fetch(`botlar.${id}.sahip`);
 var beklemede = db.fetch(`ser.${id}.durum`)
 if (beklemede == "Beklemede") return renderTemplate(res, req, "sertifikahataaa.ejs")
 if (!sahip == req.user.id) return renderTemplate(res, req, "sertifikahataa.ejs") 
 if (db.fetch(`botlar.${id}.sertifika`) == "Bulunuyor") return renderTemplate(res, req, "sertifikahata.ejs")
 
       renderTemplate(res, req, "verificationss.ejs", {id})


    
});
app.post("/sertifika/onayla/:botID", checkAuth, (req, res) => {

let ayar = req.body
let ID = req.params.botID
let s = req.user.id

  
  var name = db.fetch(`botlar.${ID}.isim`);
  var sahip = db.fetch(`botlar.${ID}.sahip`);
    var sahipid = db.fetch(`botlar.${ID}.sahipid`);

request({
url: `https://discordapp.com/api/v7/users/${ID}`,
headers: {
"Authorization": `Bot ${process.env.TOKEN}`
},
}, function(error, response, body) {
if (error) return console.log(error)
else if (!error) {
var sistem = JSON.parse(body)

db.set(`ser.${ID}.isim`, `${name}`)

db.set(`ser.${ID}.avatar`, `https://cdn.discordapp.com/avatars/${sistem.id}/${sistem.avatar}.png`)
    db.set(`ser.${ID}.id`, ID)
    db.set(`ser.${ID}.durum`, 'Beklemede')
  
request({
url: `https://discordapp.com/api/v7/users/${req.user.id}`,
headers: {
"Authorization": `Bot ${process.env.TOKEN}`
},
}, function(error, response, body) {
if (error) return console.log(error)
else if (!error) {
var sahip = JSON.parse(body)
res.redirect("/");

}})
}})
  
  
client.channels.get(client.ayarlar.kayıt).send(`<@${req.user.id}> adlı kullanıcı **${name}** adlı botu için sertifika doğrulaması talep etti. | Yetkili ekibi kısa süre içersinde onay verecektir / vermeyecektir.`)
  
  
});
    app.get("/botyonetici/sertifikaonayla/:botID", checkAuth, (req, res) => {
 if(!client.yetkililer == req.user.id) return res.redirect('/yetkili/hata')

let id = req.params.botID
let owneridd = db.fetch(`botlar.${id}.sahipid`)

res.redirect("/yetkili")
                                                    
  db.set(`botlar.${id}.sertifika`, "Bulunuyor")
  db.delete(`ser.${id}`)
  db.set(`sertifikak.${owneridd}.durum`, "Bulunuyor")
//    client.users.get(owneridd).addRole("742005822053417103")
//client.users.get(id).addRole("742005825790279770")
    client.channels.get(client.ayarlar.kayıt).send(`**<@${db.fetch(`botlar.${id}.sahipid`)}>** adlı kullanıcının **${db.fetch(`botlar.${id}.isim`)}** adlı botun sertifika isteği onaylandı.`)
});
  
  
        app.get("/yetkili-sers", checkAuth, (req, res) => {

  
 if(!client.yetkililer == req.user.id) return res.redirect('/yetkili/hata')
   
  
renderTemplate(res, req, "d-panel-serr.ejs") 
});

app.get("/botyonetici/sertifikareddet/:botID", checkAuth, (req, res) => {
 if(!client.yetkililer == req.user.id) return res.redirect('/yetkili/hata')

  let id = req.params.botID
  
    db.delete(`botlar.${id}.sertifika`)
  
    db.delete(`sertifikak.${id}.durum`)
  db.delete(`ser.${id}`) 
  
  res.redirect("/yetkili")
  
      client.channels.get(client.ayarlar.kayıt).send(`**${db.fetch(`botlar.${id}.isim`)}** adlı botun sertifika isteği reddedildi!`)

  });
  app.get("/admin-p", checkAuth, (req, res) => {
  if(!client.yetkililer.includes(req.user.id) ) return res.redirect('/yetkili/hata')
renderTemplate(res, req, "admin-p.ejs") 
});

  app.get("/botyonetici/sertifikasil/:botID", checkAuth, (req, res) => {
  if(!client.yetkililer == req.user.id) return res.redirect('/yetkili/hata')

  let id = req.params.botID
let owneridd = db.fetch(`botlar.${id}.sahipid`)

    db.delete(`botlar.${id}.sertifika`)
  
    db.delete(`sertifikak.${id}.durum`)
      client.users.get(owneridd).removeRole("742005822053417103")
client.users.get(id).removeRole("742005825790279770")
  db.delete(`ser.${id}`) 
  
  res.redirect("/admin-p")
  
      client.channels.get(client.ayarlar.kayıt).send(`**${db.fetch(`botlar.${id}.isim`)}** adlı botun sertifikası alındı!`)

  });
app.get("/sertifika/:userID", checkAuth, (req, res) => {

  request({
    url: `https://discordapp.com/api/v7/users/${req.params.userID}`,
    headers: {
      "Authorization": `Bot ${process.env.TOKEN}`
    },
  }, function(error, response, body) {
    if (error) return console.log(error)
    else if (!error) {
      var kisi = JSON.parse(body)

      renderTemplate(res, req, "verifications.ejs", {kisi})
    };
  });

});  

app.get("/botyonetim/hata", (req, res) => {
  
renderTemplate(res, req, "hataa.ejs")
});

app.get("/botekle/hata", (req, res) => {
 
renderTemplate(res, req, "hataaa.ejs")
});

app.get("/botekle", checkAuth, (req, res) => {
 
renderTemplate(res, req, "botekle.ejs")
});

app.get("/spanel", checkAuth, (req, res) => {
 
renderTemplate(res, req, "d-panel.ejs")
});
app.post("/botekle", checkAuth, (req, res) => {

let ayar = req.body

if (ayar === {} || !ayar['botid'] || !ayar['botprefix'] || !ayar['kutuphane'] || !ayar['kisa-aciklama'] || !ayar['uzun-aciklama'] || !ayar['etikett']) return res.redirect('/botyonetim/hata')

let ID = ayar['botid']

if (db.has('botlar')) {
    if (Object.keys(db.fetch('botlar')).includes(ID) === true) return res.redirect('/botekle/hata')
}
  
  var tag = ''
  if (Array.isArray(ayar['etikett']) === true) {
    var tag = ayar['etikett']
  } else {
    var tag = new Array(ayar['etikett'])
  }

request({
url: `https://discordapp.com/api/v7/users/${ID}`,
headers: {
"Authorization": `Bot ${process.env.TOKEN}`
},
}, function(error, response, body) {
if (error) return console.log(error)
else if (!error) {
var sistem = JSON.parse(body)

db.set(`botlar.${ID}.id`, sistem.id)
db.set(`botlar.${ID}.isim`, sistem.username+"#"+sistem.discriminator)
db.set(`botlar1.${ID}.isim`, sistem.username+"#"+sistem.discriminator)
db.set(`botlar1.${ID}.id`, sistem.id)

db.set(`botlar.${ID}.avatar`, `https://cdn.discordapp.com/avatars/${sistem.id}/${sistem.avatar}.png`)

request({
url: `https://discordapp.com/api/v7/users/${req.user.id}`,
headers: {
"Authorization": `Bot ${process.env.TOKEN}`
},
}, function(error, response, body) {
if (error) return console.log(error)
else if (!error) {
var sahip = JSON.parse(body)

db.set(`botlar.${ID}.prefix`, ayar['botprefix'])
db.set(`botlar.${ID}.kutuphane`, ayar['kutuphane'])
db.set(`botlar.${ID}.sahip`, sahip.username+"#"+sahip.discriminator)
db.set(`botlar.${ID}.sahipid`, sahip.id)
db.set(`botlar.${ID}.kisaaciklama`, ayar['kisa-aciklama'])
db.set(`botlar.${ID}.uzunaciklama`, ayar['uzun-aciklama'])
db.set(`botlar.${ID}.etiket`, tag)

db.set(`botlar1.${ID}.prefix`, ayar['botprefix'])

if (ayar['botsite']) {
db.set(`botlar.${ID}.site`, ayar['botsite'])
}
if (ayar['github']) {
db.set(`botlar.${ID}.github`, ayar['github'])
}
if (ayar['botdestek']) {
db.set(`botlar.${ID}.destek`, ayar['botdestek'])
}

db.set(`kbotlar.${req.user.id}.${ID}`, db.fetch(`botlar.${ID}`))

res.redirect("/kullanici/"+req.user.id);

client.channels.get(client.ayarlar.kayıt).send(`\`${req.user.username}#${req.user.discriminator}\` adlı kullanıcı \`${sistem.id}\` ID'sine sahip \`${sistem.username}#${sistem.discriminator}\` adlı botunu sıraya ekledi. Botu onaylanmayı bekliyor.`)

if (client.users.has(req.user.id) === true) {
  client.users.get(req.user.id).send(`:tada: \`${sistem.username}#${sistem.discriminator}\` adlı botunuz başarıyla sıraya eklendi. Onaylanmasını bekleyin.`)
}

}})
}})

});

app.get("/kullanici/:userID", (req, res) => {

  request({
    url: `https://discordapp.com/api/v7/users/${req.params.userID}`,
    headers: {
      "Authorization": `Bot ${process.env.TOKEN}`
    },
  }, function(error, response, body) {
    if (error) return console.log(error)
    else if (!error) {
      var kisi = JSON.parse(body)

      renderTemplate(res, req, "profil.ejs", {kisi})
    };
  });

});

app.get("/kullanici/:userID/profil", (req, res) => {

  request({
    url: `https://discordapp.com/api/v7/users/${req.params.userID}`,
    headers: {
      "Authorization": `Bot ${process.env.TOKEN}`
    },
  }, function(error, response, body) {
    if (error) return console.log(error)
    else if (!error) {
      var kisi = JSON.parse(body)

      renderTemplate(res, req, "profil.ejs", {kisi})
    };
  });

});

app.get("/kullanici/:userID/duzenle/:botID", checkAuth, (req, res) => {

var id = req.params.botID


renderTemplate(res, req, "duzenle.ejs", {id})

});


app.post("/kullanici/:userID/duzenle/:botID", checkAuth, (req, res) => {

let ayar = req.body
let ID = req.params.botID
let s = req.user.id

var tag = ''
  if (Array.isArray(ayar['etikett']) === true) {
    var tag = ayar['etikett']
  } else {
    var tag = new Array(ayar['etikett'])
  }

request({
url: `https://discordapp.com/api/v7/users/${ID}`,
headers: {
"Authorization": `Bot ${process.env.TOKEN}`
},
}, function(error, response, body) {
if (error) return console.log(error)
else if (!error) {
var sistem = JSON.parse(body)

db.set(`botlar.${ID}.isim`, sistem.username+"#"+sistem.discriminator)

db.set(`botlar.${ID}.avatar`, `https://cdn.discordapp.com/avatars/${sistem.id}/${sistem.avatar}.png`)

request({
url: `https://discordapp.com/api/v7/users/${req.user.id}`,
headers: {
"Authorization": `Bot ${process.env.TOKEN}`
},
}, function(error, response, body) {
if (error) return console.log(error)
else if (!error) {
var sahip = JSON.parse(body)
db.set(`botlar.${ID}.prefix`, ayar['botprefix'])
db.set(`botlar.${ID}.kutuphane`, ayar['kutuphane'])
db.set(`botlar.${ID}.sahip`, sahip.username+"#"+sahip.discriminator)
db.set(`botlar.${ID}.sahipid`, sahip.id)
db.set(`botlar.${ID}.kisaaciklama`, ayar['kisa-aciklama'])
db.set(`botlar.${ID}.uzunaciklama`, ayar['uzun-aciklama'])
db.set(`botlar.${ID}.etiket`, tag)
if (ayar['botsite']) {
db.set(`botlar.${ID}.site`, ayar['botsite'])
}
if (ayar['github']) {
db.set(`botlar.${ID}.github`, ayar['github'])
}
if (ayar['botdestek']) {
db.set(`botlar.${ID}.destek`, ayar['botdestek'])
}

res.redirect("/kullanici/"+req.params.userID);
let id = req.params.botID
client.channels.get(client.ayarlar.kayıt).send(`<@${req.user.id}> adlı kullanıcı \`${sistem.id}\` ID'ye sahip \`${sistem.username}#${sistem.discriminator}\` adlı botunun başvurusunu&profilini düzenledi. ${edit}\nhttps://discord-bots-world.glitch.me/bot/${db.fetch(`botlar.${id}.id`)}`)
var edit = client.emojis.get("566200909470629889")

if (client.users.has(req.user.id) === true) {
client.users.get(req.user.id).send(`\`${sistem.username}#${sistem.discriminator}\` adlı botunuzun profili&başvurusu başarıyla düzenlendi. ${edit}`)
}

}})
}})

});

app.get("/bot/:botID/rapor", checkAuth, (req, res) => {

renderTemplate (res, req, "rapor.ejs");
});

app.post("/bot/:botID/rapor", checkAuth, (req, res) => {

let ayar = req.body

if(ayar['mesaj-1']) {
db.push(`botlar.${req.params.botID}.raporlar`, JSON.parse(`{ "rapor":"${ayar['mesaj-1']}" }`))
client.channels.get(client.ayarlar.rapor).send(`<@${req.user.id}> adlı kullanıcı \`${db.fetch(`botlar.${req.params.botID}.isim`)}\` adlı botu raporladı! \n**Sebep:** \`${ayar['mesaj-1']}\``)
}
if(ayar['mesaj-2']) {
db.push(`botlar.${req.params.botID}.raporlar`, JSON.parse(`{ "rapor":"${ayar['mesaj-2']}" }`))
client.channels.get(client.ayarlar.rapor).send(`<@${req.user.id}> adlı kullanıcı \`${db.fetch(`botlar.${req.params.botID}.isim`)}\` adlı botu raporladı! \n**Sebep:** \`${ayar['mesaj-2']}\``)
}

res.redirect('/bot/'+req.params.botID);
});

app.get("/kullanici/:userID/sil/:botID", checkAuth, (req, res) => {
  var id = req.params.botID
  renderTemplate(res, req, "sil.ejs", {id}) 
});

app.post("/kullanici/:userID/sil/:botID", checkAuth, (req, res) => {

let ID = req.params.botID

db.delete(`botlar.${ID}`) 
db.delete(`kbotlar.${req.user.id}.${ID}`)

res.redirect("/kullanici/"+req.params.userID);
});

app.get("/bot/:botID", (req, res) => {
var id = req.params.botID

request({
url: `https://discordapp.com/api/v7/users/${id}`,
headers: {
"Authorization": `Bot ${process.env.TOKEN}`
},
}, function(error, response, body) {
if (error) return console.log(error)
else if (!error) {
var sistem = JSON.parse(body)

if (db.fetch(`${id}.avatar`) !== `https://cdn.discordapp.com/avatars/${sistem.id}/${sistem.avatar}.png`) {
db.set(`${id}.avatar`, `https://cdn.discordapp.com/avatars/${sistem.id}/${sistem.avatar}.png`)
}

}
})

renderTemplate(res, req, 'bot.ejs', {id})

});

app.get("/bot/:botID/hata", (req, res) => {
renderTemplate(res, req, "hata.ejs")
});

app.get("/bot/:botID/oyver", checkAuth, (req, res) => {

var id = req.params.botID
let user = req.user.id

var saat = `${new Date().getHours() + 3}:${new Date().getMinutes()}:${new Date().getSeconds()}`

if (db.has(`oylar.${id}.${user}`) === true) {
  if (db.fetch(`oylar.${id}.${user}`) < saat) {
    res.redirect('/bot/'+req.params.botID+'/hata')
    return
  } else if (db.fetch(`oylar.${id}.${user}`) >= saat) {
  db.add(`botlar.${id}.oy`, 1)
  db.set(`oylar.${id}.${user}`, saat)
  }
} else {
  db.add(`botlar.${id}.oy`, 1)
  db.set(`oylar.${id}.${user}`, saat)
}

res.redirect('/bot/'+req.params.botID)

});
  
  app.get("/yetkili/hata", (req, res) => {
    renderTemplate(res, req, "hate.ejs")
  })

app.get("/yetkili", checkAuth, (req, res) => {
  if(!client.yetkililer.includes(req.user.id) ) return res.redirect('/yetkili/hata')
renderTemplate(res, req, "y-panel.ejs") 
});

app.get("/botyonetici/onayla/:botID", checkAuth, (req, res) => {
  if(!client.yetkililer.includes(req.user.id) ) return res.redirect('/yetkili/hata')
let id = req.params.botID
let owneridd = db.fetch(`botlar.${id}.sahipid`)

db.set(`botlar.${id}.durum`, 'Onaylı')
//client.members.get(db.fetch(`botlar.${id}.sahipid`)).addRole("742005826679603230")
//client.members.get(`${id}`).addRole("742005826679603230")
res.redirect("/yetkili")

client.channels.get(client.ayarlar.kayıt).send(`<@${req.user.id}> adlı yetkili tarafından <@${db.fetch(`botlar.${id}.sahipid`)}> adlı kullanıcının \`${db.fetch(`botlar.${id}.id`)}\` ID'ine sahip \`${db.fetch(`botlar.${id}.isim`)}\` adlı botu onaylandı.\nhttps://discord-bots-world.glitch.me/bot/${db.fetch(`botlar.${id}.id`)}`)

if (client.users.has(db.fetch(`botlar.${id}.sahipid`)) === true) {
client.users.get(db.fetch(`botlar.${id}.sahipid`)).send(`:tada: \`${db.fetch(`botlar.${id}.isim`)}\` adlı botunuz onaylandı.\nhttps://discord-bots-world.glitch.me/bot/${db.fetch(`botlar.${id}.id`)}`)
}

});

app.get("/botyonetici/bekleme/:botID", checkAuth, (req, res) => {
  if(!client.yetkililer.includes(req.user.id) ) return res.redirect('/yetkili/hata')
let id = req.params.botID

db.set(`botlar.${id}.durum`, 'Beklemede')

res.redirect("/yetkili")

client.channels.get(client.ayarlar.kayıt).send(`<@${req.user.id}> adlı yetkili tarafından \`${db.fetch(`botlar.${id}.sahip`)}\` adlı kullanıcının \`${db.fetch(`botlar.${id}.id`)}\` ID'ine sahip \`${db.fetch(`botlar.${id}.isim`)}\` adlı botu beklemeye alındı.`)

if (client.users.has(db.fetch(`botlar.${id}.sahipid`)) === true) {
client.users.get(db.fetch(`botlar.${id}.sahipid`)).send(`\`${db.fetch(`botlar.${id}.isim`)}\` adlı botunuz beklemeye alındı!`)
}

});

app.get("/botyonetici/reddet/:botID", checkAuth, (req, res) => {
  if(!client.yetkililer.includes(req.user.id) ) return res.redirect('/yetkili/hata')
  renderTemplate(res, req, "reddet.ejs")
});

app.post("/botyonetici/reddet/:botID", checkAuth, (req, res) => {
  if(!client.yetkililer.includes(req.user.id) ) return res.redirect('/yetkili/hata')
  let id = req.params.botID
  
  db.delete(`botlar.${id}`)
    db.set(`botlar1.${id}.durum`, 'Reddedilmiş')

  res.redirect("/yetkili")
  
  client.channels.get(client.ayarlar.kayıt).send(`\`${req.user.username}#${req.user.discriminator}\` adlı yetkili tarafından \`${db.fetch(`botlar.${id}.sahip`)}\` adlı kullanıcının \`${db.fetch(`botlar.${id}.id`)}\` ID'ine sahip \`${db.fetch(`botlar.${id}.isim`)}\` adlı botu \`${req.body['red-sebep']}\` sebebi ile reddedildi. `)
  
  if (client.users.has(db.fetch(`botlar.${id}.sahipid`)) === true) {
  client.users.get(db.fetch(`botlar.${id}.sahipid`)).send(`\`${db.fetch(`botlar.${id}.isim`)}\` adlı botunuz \`${req.body['red-sebep']}\` sebebi ile reddedildi.`)
  }

  });

//API
  
app.get("/api", (req, res) => {
  renderTemplate(res, req, "api.ejs")
});

app.get("/api/botlar", (req, res) => {
  res.json({
    hata: 'Bir bot ID yazınız.'
  });
});

app.get("/api/botlar/:botID/oylar", (req, res) => {
  res.json({
    hata: 'Bir kullanıcı ID yazınız.'
  });
});

app.get("/api/botlar/:botID", (req, res) => {
   var id = req.params.botID

   if (db.has('botlar')) {
      if (Object.keys(db.fetch('botlar')).includes(id) === false) {
     res.json({
       hata: 'Yazdığınız ID\'e sahip bir bot sistemde bulunmuyor.'
     });
   }
  }

    res.json({
       isim: db.fetch(`botlar.${id}.isim`),
       id: id,
avatar: db.fetch(`botlar.${id}.avatar`),
prefix: db.fetch(`botlar.${id}.prefix`),
kütüphane: db.fetch(`botlar.${id}.kutuphane`),
sahip: db.fetch(`botlar.${id}.sahip`),
sahipid: db.fetch(`botlar.${id}.sahipid`),
kisa_aciklama: db.fetch(`botlar.${id}.kisaaciklama`),
uzun_aciklama: db.fetch(`botlar.${id}.uzunaciklama`),
etiketler: db.fetch(`botlar.${id}.etiket`),
destek_sunucusu: db.fetch(`botlar.${id}.destek`) || 'Belirtilmemiş',
web_sitesi: db.fetch(`botlar.${id}.site`) || 'Belirtilmemiş',
github: db.fetch(`botlar.${id}.github`) || 'Belirtilmemiş',
durum: db.has(`botlar.${id}.durum`) ? db.fetch(`botlar.${id}.durum`) : 'Beklemede',
oy_sayisi: db.fetch(`botlar.${id}.oy`) || 0,
sertifika: db.fetch(`botlar.${id}.sertifika`) || 'Bulunmuyor'
    });
});

  app.get("/api/tumbotlar", (req, res) => {
    res.json(Object.keys(db.fetch('botlar')));
  });
  
app.get("/api/botlar/:botID/oylar/:kullaniciID", (req, res) => {
  var id = req.params.botID
  var userr = req.params.kullaniciID

  if (db.has('botlar')) {
      if (Object.keys(db.fetch('botlar')).includes(id) === false) {
     res.json({
       hata: 'Yazdığınız ID\'e sahip bir bot sistemde bulunmuyor.'
     });
   }
  }
   res.json({
     oy_durum: db.has(`oylar.${id}.${userr}`) ? `Bugün oy vermiş.` : `Bugün oy vermemiş.`,
     oy_sayisi: db.fetch(`botlar.${id}.oy`) || 0
   });

});

app.listen(3000);

//Blog

app.get("/blog", (req, res) => {
  res.redirect('/');
});
  
};
