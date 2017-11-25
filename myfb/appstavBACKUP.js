/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
'use strict';

const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  request = require('request'),
  https = require('https');




var app = express();
app.set('port', process.env.PORT || 8080);



//app.use(bodyParser.json(/*{ verify: verifyRequestSignature }*/));
app.use(bodyParser.urlencoded({ extended: true }));
//
//app.use(bodyParser.json())
/*
var webclient = require('./webclient.js')
webclient(app);*/


/**/

var path = require('path');
app.get('/chatsim'/*,adminlogged*/,function (req,res){
      res.sendFile('index.html', { root: path.join(__dirname, '/test/chatsim/dist')} );

      });
app.get('/main.bundle.js',function(req,res){
  res.sendFile( 'main.bundle.js',{ root: path.join(__dirname, '/test/chatsim/dist')}) ;

})
app.get('/polyfills.bundle.js',function(req,res){
  res.sendFile( 'polyfills.bundle.js',{ root: path.join(__dirname, '/test/chatsim/dist')}) ;

})
app.get('/styles.bundle.js',function(req,res){
  res.sendFile('styles.bundle.js',{ root: path.join(__dirname, '/test/chatsim/dist')}) ;

})

app.get('/vendor.bundle.js',function(req,res){
  res.sendFile( 'vendor.bundle.js',{ root: path.join(__dirname, '/test/chatsim/dist')}) ;

})
app.get('/inline.bundle.js',function(req,res){
  res.sendFile( 'inline.bundle.js',{ root: path.join(__dirname, '/test/chatsim/dist')}) ;

})

var recentSenders = {'id1':'sometime','id2':'sometime+1','id3':'sometime+2'}
app.post('/chatsim', function(req, res) {
        //console.log("request:",JSON.stringify(req))
        console.log(req.body)
        console.log("new message from user with senderID:" + req.body.senderID);
        console.log(req.body.msg);

        var senderID = req.body.senderID;
        var message= req.body.msg;
        if (!(recentSenders[req.body.senderID])){
          var Sender = printDB.findFBUser(senderID);
          if (!Sender){
            console.log("Could not find a subscribed user under ID:",senderID);
            //should fetch data with fbGraph
          }
          else {
            console.log("User is known under:",JSON.stringify(Sender))
          }
        }
        /*x=0;
        toBotStream.push('#'+message+'\n');
        while(!x){

        }*/
        //have to create
      });

      /*
function botRespSim(textmsg,callbackf,secCallBack){
  callbackf('#'+textmsg+'\n');


}

function newReplyReady(x){
  return x;
}
//reply from python bot.
var x=0;
botReply.on('line', (chatterBotRep) => {

  chatterBotRep = JSON.parse(chatterBotRep);
  processResp(chatterBotRep);
  x = 1;
});*/

      /*function newMessage(){
        if (!recentSenders[senderID]){//message from new user.
          recentSenders[senderID]=timeOfMessage;
          getSenderObj from database

        }
        {


        }
      }*/

var spawn = require('child_process').spawn;

var pybot = spawn('python3',['pybots/printbot.py']  ,{
    stdio: [
    'pipe', // Use pipe as stdin of child
    'pipe', // use pipe as stdout of child
    1 // Direct child's stderr to parent's stdout
  ]});

var botResp ='';

//only one session. Don't know for whom the response is.
const stavID="1632677676746653";
const panosID="";
const ZorbID="";
var chatSession = [];
chatSession.push(stavID);
pybot.stdout.setEncoding('utf8');

/*
pybot.stdout.on('data', function(data){
  botResp += data.toString();
  console.log("bot says:",botResp)
  botResp ='';
});
*/
/*
pybot.stdout.on('end', function(){
  console.log('Bot says=',botResp);
});
*/

//only one session. Don't know for whom the response is.
//someStream needed for readline
const Writable = require('stream').Writable;
const myWritable = new Writable({
  write(chunk, encoding, callback) {}
});

const readline = require('readline');
const botReply = readline.createInterface({
  input: pybot.stdout,
  output: myWritable
});


var printDB = require('./printNearDB.js');
var readline2 = require('readline');
var myConsole = readline2.createInterface(process.stdin, process.stdout);
myConsole.setPrompt('console> ');
myConsole.prompt();
printDB.connect();
/*
myConsole.question('Enter password for printDB:',(passattempt)=>{
  console.log("zbutsam");
  printDB.connect();
})*/
myConsole.on('line', (command) => {
    if (command === "stop") myConsole.close();
    else if (command =='pystop') pybot.kill('SIGINT');

    myConsole.prompt();
}).on('close',function(){
    process.exit(0);
});

pybot.on('close', (code) => {
  console.log(`Pybot process exited with code ${code}`);
});

//reply from python bot.
botReply.on('line', (chatterBotRep) => {

  chatterBotRep = JSON.parse(chatterBotRep);
  processResp(chatterBotRep);

});

function processResp(resp)
{
  console.log("Processing bot's response...");
  if (resp.SIM ){ //simulation

   }
  if (resp.code =='0'){
    sendTextMessage(chatSession[resp.sessID],resp.txt);
  }
  else if (resp.code == '1'){
    //coffee order found
    var validateOrderMsg = 'Παραγγείλατε:';
    var kaf;
    for (var i=0; i<resp.ordLen;i++ ){
     var kaf= resp.order[i];
      validateOrderMsg = validateOrderMsg+kaf.pl+kaf.cof+"με ζάχαρη:"+kaf.sug+'.';
    }
   sendTextMessage(chatSession[resp.sessID],validateOrderMsg);
  }
  else if (resp.code == '2'){
    console.log("About to send a plain list template to" +chatSession[resp.sessID])
    sendPlainListTemplate(chatSession[resp.sessID]);
  }




}
botReply.on('close',(err)=>{
  console.log("WTF?",err)
});


var Readable = require('stream').Readable;
var toBotStream = new Readable;
toBotStream.setEncoding('utf8');
toBotStream._read = function noop() {};
/*
console.log("About to push a string");
toBotStream.push('Ainte\n');    // the string you want
toBotStream.push('re eisai kai gamw.\n');
*/
toBotStream.on("error", function(e) { console.log("WTF:",e); });
console.log("About to pipe");
toBotStream.pipe(pybot.stdin,{ end: false },(err)=>{console.log("Malakia:",err)});
console.log("Piped");




/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 *
 */

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
  console.error("Missing config values");
  process.exit(1);
}

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

/*

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else if (messagingEvent.read) {
          receivedMessageRead(messagingEvent);
        } else if (messagingEvent.account_linking) {
          receivedAccountLink(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL.
 *
 */
app.get('/authorize', function(req, res) {
  var accountLinkingToken = req.query.account_linking_token;
  var redirectURI = req.query.redirect_uri;

  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  var authCode = "1234567890";

  // Redirect users to this URI on successful login
  var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  res.render('authorize', {
    accountLinkingToken: accountLinkingToken,
    redirectURI: redirectURI,
    redirectURISuccess: redirectURISuccess
  });
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger'
  // plugin.
  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam,
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  sendTextMessage(senderID, "Authentication successful");
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */




function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));


  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s",
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'image':
        sendImageMessage(senderID);
        break;

      case 'gif':
        sendGifMessage(senderID);
        break;

      case 'audio':
        sendAudioMessage(senderID);
        break;

      case 'video':
        sendVideoMessage(senderID);
        break;

      case 'file':
        sendFileMessage(senderID);
        break;

      case 'button':
        sendButtonMessage(senderID);
        break;

      case 'generic':
        sendGenericMessage(senderID);
        break;

      case 'receipt':
        sendReceiptMessage(senderID);
        break;

      case 'quick reply':
        sendQuickReply(senderID);
        break;

      case 'read receipt':
        sendReadReceipt(senderID);
        break;

      case 'typing on':
        sendTypingOn(senderID);
        break;

      case 'typing off':
        sendTypingOff(senderID);
        break;

      case 'account linking':
        sendAccountLinking(senderID);
        break;

      default:
         //sendTextMessage(senderID,"manari mou.");
        //do we have user's fbID? meaning has he used the app before?
        //check mongoose db
        //if not sign up
        //else continue

        /*Text messagin from 3 users (stav,alexzorbas,Panos) */
        /*should authenticate for production */

        // checkSender
        //if malakas block

        //else getdbID


        //verifyUser
        //if new and OK -> chatSession.push(senderID)
        //else wait for registration

        console.log("About to push");
        //toBotStream.push({sess:text:messageText}+'\n');
        toBotStream.push(messageText+'\n');
        console.log("Managed to write it.");

        //sendTextMessage(senderID, messageText);
        //sendSelectPrintPropertiesMessage(senderID);


    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
    /*stavros*/
    if (message.attachments[0].type == "file")
    {
      sendTextMessage(senderID, "Thanks !");

      if (message.attachments.length>1)
            sendTextMessage(senderID,"Wow, ("+message.attachments.length+") files received.");


      console.log("Received file attachment from user %d",senderID);
      console.log("url=",message.attachments[0].payload.url);
      for (var i=0; i<message.attachments.length;i++){
          getFilenameType(message.attachments[i].payload.url,senderID);
      }


      sendSelectPrintPropertiesMessage(senderID);

    //check payload for pdf (or doc)

     //download
     //user folder. distribute to offices.
     //ask for print properties

   /**/
    }
  }
}





function getFilenameType(url,senderID)
{
  var fnStart;
  var count = 0;

  fnStart = url.lastIndexOf("/")+1; //start of filename.

  var i=fnStart;
  //File name start == fnStart;
  var file_name =''; //diploma.pdf
  var file_type =''; // '.pdf' '.doc'

  while (url[i]!='.' && i<url.length )
  {
   file_name+= url[i];
   i++;
  }
  while(url[i]!='?' && i<url.length)
  {
   file_type+=url[i];
   i++;
  }
  file_name+=file_type;
  console.log("Received file:",file_name);
  if ((file_type!='.pdf')&&(file_type!='.doc')&&(file_type!='.docx')&&(file_type!='odt'))
     console.log('Only Word or .pdf files are accepted.');
     sendTextMessage(senderID,"I cannot read this file.")
 /* else
     downloadAttachment(myurl,full_file);*/

}
/*
function downloadAttachment(url,fname)
{
  var dl = require('download-file');
  var opts = {
    directory: "",
    filename: fname
  }
  dl(url,opts,function(err){
    if (err) throw err
    console.log("ok");
  })
}*/

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var delivery = event.delivery;
  var messageIDs = delivery.mids;
  var watermark = delivery.watermark;
  var sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      console.log("Received delivery confirmation for message ID: %s",
        messageID);
    });
  }

  console.log("All message before %d were delivered.", watermark);
}


/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
function receivedMessageRead(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  // All messages before watermark (a timestamp) or sequence have been seen.
  var watermark = event.read.watermark;
  var sequenceNumber = event.read.seq;

  console.log("Received message read event for watermark %d and sequence " +
    "number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 *
 */
function receivedAccountLink(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  var status = event.account_linking.status;
  var authCode = event.account_linking.authorization_code;

  console.log("Received account link event with for user %d with status %s " +
    "and auth code %s ", senderID, status, authCode);
}

/*
 * Send an image using the Send API.
 *
 */

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
