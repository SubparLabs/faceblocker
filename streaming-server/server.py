from flask import Flask
from flask import Response
from flask_sockets import Sockets

import gevent
from gevent.queue import Queue
from gevent.queue import Channel

from geventwebsocket.websocket import WebSocketError

import random
import logging
import sys

app = Flask(__name__)

sockets = Sockets(app)



import logging

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.INFO)
app.logger.info("logging to stdout")

BUFFER_SIZE = 10

channels = []

last_frame = None

def _log(msg):
    app.logger.info(msg)
    #print msg

@sockets.route('/echo')
def echo_socket(ws):
    while True:
        message = ws.receive()
        ws.send(message)


@sockets.route('/up')
def up_socket(ws):
    try:
        subscriptions = []
        channels.append(subscriptions)
        _log("client connected up! - added channel " + str(len(channels)))
        while True:
            msg = ws.receive()
            if not msg:
                continue
            #_log("received!")
            for sub in subscriptions[:]:
                sub.put(msg)
    except WebSocketError:
        _log("WebSocketError on up! - disconnecting")
        return "OK"


@sockets.route('/feed')
def feed_socket(ws):
    def subscribe(ws):
        try:
            if not channels:
                return
            subscriptions = random.choice(channels)
            ch = Channel()
            subscriptions.append(ch)
            _log("feed ready! - added subscription " + str(len(subscriptions)))
            while True:
                #_log("getting")
                msg = ch.get()
                if not msg:
                    _log("nothing to send!")
                    continue
                ws.send(msg)
                #_log("sent!")
                gevent.sleep(0)
        except WebSocketError:
            _log("WebSocketError on feed! - retrying")
        return
    while True:
        _log("attemping to subscribe for feed")
        gevent.spawn(subscribe, ws).join()
        gevent.sleep(1)

@app.route('/')
def hello():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
