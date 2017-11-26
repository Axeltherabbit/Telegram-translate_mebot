const TeleBot = require('telebot');
const translate = require('google-translate-api');
const fs = require('fs'); //for read json

var j = JSON.parse(fs.readFileSync('languages.json', 'utf8'));

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOUTOKENHERE';

const bot = new TeleBot
({
    token: token, // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        interval: 1000, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 2500, // Optional. Reconnecting timeout (in ms).
        //proxy: 'http://username:password@yourproxy.com:8080' // Optional. An HTTP proxy to be used.
             },
});
bot.on(['/start', '/help'],
      (msg) => msg.reply.text("This bot work only inline\ntype: @translate_mebot TEXT\n\
it will translate it thanks to google translate\n\n\
Default translation : from detected_language to english\n\
How change language:\n\
@translate_mebot !fromlanguage:tolanguage TEXT\n\
'example: @translate_mebot !it:en traduci questo'\n\
Languages list: /list"));

//send languages list to user
bot.on(['/list'],(msg) => msg.reply.text(fs.readFileSync('list.txt', 'utf8')));

// On inline query
bot.on('inlineQuery', msg => {

    var query = msg.query;
    console.log(`inline query: ${ query }`);

    var div = query.split(" ");
    var froml = div[0].split(":")[0].substring(1); //split at '-' and remove first char the !
    var find = 0; //find language variables if not default translation
    if (div[0][0] == '!')
    {
      var tol   = div[0].split(":")[1]; // split at '-'

      query = '';
      var i=1;
      while (i < div.length)
        {
          query += div[i]+" ";
          i++;
        }


      i=0;
      var findto = 0;
      var findfrom = 0;
      while (i < j["languages"].length && !find)
      {//check if languages are correct
        if (j["languages"][i][0] == froml) findfrom = 1;
        if (j["languages"][i][0] == tol) findto = 1;
        if (findfrom && findto) find = 1;
        i++;
      }

    }

  //console.log(query);
  //console.log(froml);
  //console.log(tol);

    // Create a new answer list object
    const answers = bot.answerList(msg.id, {cacheTime: 60});
    if (!find) //default translation
    {
    console.log("default")
    translate(`${query}`, { to: 'en' }).then(res => {
    const trad = res.text;
    answers.addArticle({
        id: 'query',
        title: 'Translation',
        description: `${query}:\n${trad}`,
        message_text: `Translation:\n${query}\n\n${trad}`
                      });
    return bot.answerQuery(answers);                           });
    }
    else //personal translation
    {
      translate(`${query}`, { from: froml, to: tol }).then(res => {
      const trad = res.text;
      answers.addArticle({
          id: 'query',
          title: 'Translation',
          description: `${query}:\n${trad}`,
          message_text: `Translation:\n${query}\n\n${trad}`
                        });
      return bot.answerQuery(answers);                           });
    }

});

bot.start();
