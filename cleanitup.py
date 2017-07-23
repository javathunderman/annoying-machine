import os
import sched, time
s = sched.scheduler(time.time, time.sleep)
def do_something(sc): 
    print "Beginning clean up"
    os.system("mv /home/$USER/workspace/react-node-socket-io/_commentsprime.json /home/$USER/workspace/react-node-socket-io/_comments.json")
    os.system ("cp /home/$USER/workspace/react-node-socket-io/_comments.json /home/$USER/workspace/react-node-socket-io/_commentsprime.json")
    print "Ending clean up"
    s.enter(5, 1, do_something, (sc,))

s.enter(5, 1, do_something, (s,))
s.run()

