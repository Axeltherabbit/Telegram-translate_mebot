const TeleBot = require('telebot');
const translate = require('google-translate-api');
 

// replace the value below with the Telegram token you receive from @BotFather
const token = 'YOURTOKENHERE';

const bot = new TeleBot
({
    token: token, // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        interval: 500, // Optional. How often check updates (in ms).
        timeout: 0.1, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 10, // Optional. Reconnecting timeout (in ms).
        //proxy: 'http://username:password@yourproxy.com:8080' // Optional. An HTTP proxy to be used.
             },
});


// On inline query
bot.on('inlineQuery', msg => {

    let query = msg.query;
    console.log(`inline query: ${ query }`);

    // Create a new answer list object
    const answers = bot.answerList(msg.id, {cacheTime: 60});
    
    //translate fun
    translate(`${query}`, { to: 'en' }).then(res => {
       const trad = res.text;
       if (trad != "")
          {
           answers.addArticle({
               id: 'query',
               title: 'Translation',
               description: trad,
               message_text: trad
                             });
           }
       return bot.answerQuery(answers);}).catch(err => {console.error(err);});
           
    })

bot.start();
