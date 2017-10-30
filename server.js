const Botkit = require('botkit'),
couchDbStorage = require('botkit-storage-couchdb')({"url": "http://35.196.88.213:5984/botkit"}),
      nano = require('nano')('http://35.196.88.213:5984');
//nano.db.destroy('bots')     
//var token = process.env.SLACK_TOKEN;
var msg = [];
nano.db.create('bots');
//nano.create('bots');

//var db= nano.use(bots)
var bots = nano.db.use('bots')

var config = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.ACCESS_TOKEN,
    token_secret: process.env.ACCESS_TOKEN_SECRET
};
var controller = Botkit.slackbot({
    debug: false,
    retry: Infinity,
    storage: couchDbStorage
});
if(config.token){
  console.log('Starting in a single team mode');
  controller.spawn({
    token: config.token
  }).startRTM(function(err,bot,payload){
    if(err){
      throw new Error(err);
    }

    console.log('Connected to slack RTM');
  });

} else{
  console.log('Starting bot in beep boop mode');
  require('beepboop-botkit').start(controller,{debug:true});
}

controller.on('bot_channel_join',function(bot,message){
  bot.reply(message,"I'm here!");
});
var i=0;
controller.hears(['hi', 'hello', 'bot', 'whats up', 'sup'],'direct_message', function(bot, message) {
    msg.push(message.text);
    //controller.storage.users.save({id:i++,message : msg});
    bot.reply(message, 'Hi there!');

bot.startConversation(message,function(err,convo) {

      convo.addQuestion('How are you?',function(response,convo){
      msg.push(response.text);
      console.log('Intent:', response.text);
      //controller.storage.users.save({id:i++,message : msg});
        convo.next();
      },{},'default');


      convo.addQuestion('Where do you work?',function(response,convo){
      msg.push(response.text);
      console.log('Intent:', response.text);
      //controller.storage.users.save({id:i++,message : msg});
        convo.next();
      },{},'default');

      convo.addQuestion('Where do you live?',function(response,convo){
      msg.push(response.text);
      console.log('Intent:', response.text);
      //controller.storage.users.save({id:i++,message : msg});
        console.log(msg);
        //controller.storage.users.save({id:i,message:msg});
        bots.insert({id:message.user,text:msg}, function(err, body) {
  if (!err)
    console.log(body);
});
        convo.next();
      },{},'default');
  //convo.activate();
  
  convo.addMessage('Thank you for using this bot');
  
//controller.storage.users.save({id:convo.user, res1 : msg1 ,res2 :msg2 , res3:msg3});
   });

  //bots.insert({ _id: 'myid', crazy: "true" });
nano.db.get('bots', function(err, body) {
  if (!err) {
    console.log(body);
  }
});
  /*
bots.list({startkey:i}, function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      console.log(doc);
    });
  }
});  */
  
  
});
