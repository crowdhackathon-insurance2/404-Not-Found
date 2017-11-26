

'use strict';




const PAGE_ACCESS_TOKEN = "EAAaARaMSiXMBAAWYwrDa7JjuWfHgtt1I1CxiVlDtLY5QeqPpyAtnP8bjS34QNKpYxIUthZBC24rRpB9T7IfrVe4yK81uTgFOMvb9ciZC9uhOeQXcZCauSpz6SyLmbOpF4LB1KD4lnwEEAXOBD9R812MHOJOUeAOtEkg1SWzKgAWTOX0lPeZA";;
// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  morgan = require('morgan'),
  //Include the DATABASE
  db = require('./db.js'),
  levenshtein = require('fast-levenshtein'),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 8080, () => console.log('webhook is listening'));
// Accepts POST requests at /webhook endpoint
app.use(morgan('dev')); // log every request to the console
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})
// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {

        handlePostback(sender_psid, webhook_event.postback);
      }

    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});



// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  console.log("received webhook");
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "INSUREEE";

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {

    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
function dbInsert(User){

}
var User;//global
function getUserInfo(sender_psid,dbGet){

    console.log("About to fetch user info...")

    User= db.get(sender_psid);
    if (User == 0){
          console.log("User not registered.");
          const URL="https://graph.facebook.com/v2.6/" + sender_psid + "?fields=first_name,last_name,profile_pic" + "&access_token=" +PAGE_ACCESS_TOKEN;
          request(URL,function (error,resp,body){
             User=body;
             console.log("Fetched from FB:",User)
             db.insert(User);
          });
    }

}

function getBestMatch(msg){

  var lev_min = 65000;
  var best_match = '';
  var lev_dist ;
  var msgs_def = ['γεια σου','Θελω ασφαλεια υγειας','τι ειναι νοσοκομειακο;','θελω νοσοκομειακο','15-1-92','δασκαλος','0','σιγουρα δεν θα πληρωσω τιποτα εγω;'];
  for (var i=0;i<msgs_def.length;i++){
    lev_dist=levenshtein.get(msgs_def[i],msg)
    if ((lev_dist<lev_min )){
      lev_min =lev_dist;
      best_match = msgs_def[i];
      console.log("lev:",lev_dist )
    }
  }
  console.log("Received :",msg,"best match:",best_match)
  return best_match;
}

function handleMessage(sender_psid, received_message) {
  let response;
  getUserInfo()

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    let best_match = getBestMatch(received_message.text)
    switch (best_match) {


    case 'γεια σου':
      response = { "text": "Kαλημέρα Αριστοφάνη. Πως μπορώ να σε βοηθήσω;"}
      callSendAPI(sender_psid, response);
      break;
    case 'Θελω ασφαλεια υγειας':
      response = { "text": "Θέλεις ατυχημάτων ή νοσοκομειακό ή εξωνοσοκομειακές εξετάσεις;"}
      callSendAPI(sender_psid, response);
      break;
    case 'τι ειναι νοσοκομειακο;':
      response = { "text": "Εισαγωγή-Νοσηλεία σε νοσοκομειακή κλινική."}
      callSendAPI(sender_psid, response);
      break;
    case 'θελω νοσοκομειακο':
        response = { "text": "Πότε γεννήθηκες;"}
        callSendAPI(sender_psid, response);
        break;
    case '15-1-92':
        response = { "text": "Α! είστε δίδυμος.Νομίζω ότι αυτό το μήνα έχετε ανάδρομο Ερμή :-D.Τι επαγγέλεστε;"}
        callSendAPI(sender_psid, response);
        break;
    case 'δασκαλος':
          response = { "text": "Ενδιαφέρον."}
          callSendAPI(sender_psid, response);
          response = { "text": "Το συμβόλαιο θες να έχει απαλλαγή 0,500, ή 1500;"}
          callSendAPI(sender_psid, response);
          break;
    case '0':
          break;
    case 'σιγουρα δεν θα πληρωσω τιποτα εγω;':
          response = { "text": "Ναι,μην ανησυχείς συνεργαζόμαστε με ασφαλιστικές που είναι αξιόπιστες."}
          callSendAPI(sender_psid, response);

          setTimeout(function (){callSendAPI(sender_psid, { "text": "Περιμένετε να επεξεργαστώ τις πληροφορίες που μου δώσατε."})},100);
          //response =
          setTimeout(function (){callSendAPI(sender_psid, { "text": "Ορίστε τι βρήκα."})},2000);

          setTimeout(function (){callSendAPI(sender_psid,  { "text": "A' \t 1000 \u20AC \n \t \u2605 \u2605 \u2605 \u2605"})},2050);

          setTimeout(function (){callSendAPI(sender_psid, { "text": "B' \t 630 \u20AC \n \t \u2605 \u2605 \u2605"})},2500);

          setTimeout(function (){callSendAPI(sender_psid, { "text": "Γ' \t 850 \u20AC \n \t \u2605 \u2605"})},3000);

          setTimeout(function (){callSendAPI(sender_psid, { "text": "Θα ενημερωθείτε στο μέλλον αν προκύψει κάποια πιο συμφέρουσα προσφορά"})},3300);

          break;
    default:
      response = { "text": "Συγγνώμη δεν κατάλαβα."}
      callSendAPI(sender_psid, response);
    }

   /* default
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }*/
  }

  // Send the response message

}


function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}


function callSendAPI(sender_psid, response) {
  // Construct the message body
  console.log("about to send to",sender_psid)
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {

    if (!err) {

      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}
