# -*- coding: utf-8 -*-
from chatterbot import ChatBot
import logging
import sys
#import ujson
import json
import re


logging.basicConfig(level=logging.DEBUG)
mylogger = logging.getLogger(__name__)
mylogger.debug('[*]Started logging...')

# Create a new instance of a ChatBot
bot = ChatBot(
    'asfalistis',
    storage_adapter='chatterbot.storage.MongoDatabaseAdapter',
    logic_adapters=[
        {
            "import_path": "chatterbot.logic.BestMatch",
            "statement_comparison_function": "chatterbot.comparisons.levenshtein_distance",
            "response_selection_method": "chatterbot.response_selection.get_first_response"
        }
    ],
    database="asfal-bot",
    trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
)
bot.train("./asfalistis.corpus.json")


def input_function():
    if sys.version_info[0] < 3:
        user_input = str(raw_input()) # NOQA
        # Avoid problems using format strings with unicode characters
        if user_input:
            user_input = user_input.decode('utf-8')
    else:
        user_input = input() # NOQA
    return user_input




def main():
    # my code here
    while True:
        try:
            fbmessage = input_function()
            fbmessage = fbmessage.lower()
            mylogger.debug('[*]Received message:')
            sender=0; #sessID




            mylogger.debug(fbmessage)
            if fbmessage[0] == '#':
                SIM = 1; #meaning chat simulation
                fbmessage = fbmessage[1:]
                mylogger.debug('[*]CHAT SIM ON...')

            else:
                SIM = 0;

            fbmessageJ = json.loads(fbmessage)
            sender = fbmessageJ['sender']
            textmessage=fbmessageJ['message']

            response = bot.get_response(textmessage)

            if (response.text[0]=='*'):
                code = response.text[1] # meaning a choice of 9 different message options.
            else:
                code = 0; #meaning text
            jsonresp = json.dumps({"sessID":sender,"txt": response.text,"code":code,"SIM":SIM})

            sys.stdout.write(jsonresp)
            sys.stdout.write('\n')
            sys.stdout.flush()
        except (KeyboardInterrupt, EOFError, SystemExit):
            break
    # Get a response for some unexpected input
    # The following loop will execute each time the user enters input


if __name__ == "__main__":
    main()
