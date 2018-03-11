# This script is to routinely check the server for new messages if you
# can't run "say" on your system (ex. you have a VPS)

# You will still need the espeak package installed on your system.
import os
import json
import re
import subprocess
import time
def main():
    while (True):
        check()
        time.sleep(600)
def check():
    os.system("cp _comments.json oldcomments.json")
    os.system("scp [insert your server here]")
    data = json.load(open("_comments.json"))
    cmd = ["diff", "_comments.json", "oldcomments.json"]
    output = subprocess.Popen( cmd, stdout=subprocess.PIPE ).communicate()[0]
    if(output == b''):
        os.remove("oldcomments.json")
    elif(output != ""):
        speak(data)
    print("Cycle complete")

def speak(data):
    for elem in data:
        author = re.sub(r'[^\x00-\x7f]',r'', elem["author"])
        author = ("\"" + author + "\"")
        message = re.sub(r'[^\x00-\x7f]',r'', elem["text"])
        message = ("\"" + message + "\"")
        os.system("espeak " + author)
        os.system("espeak \"says\"" + message)
        time.sleep(2)

main()
