# Faceblocker

"Block" ads in Chrome and replace them with your face and other gr8 things.
*with thanks to [butlern](https://github.com/butlern) & [xnder](https://github.com/xnder)*

### To load the Chrome Extension

1. Go to chrome://extensions/
2. Check *Developer Mode*
3. Click on 'Load Unpacked Extension'
4. Select the 'faceblocker' directory

### How to get roulette working

1. Run the WebSockets server locally (for now)
	- cd streaming-server 
	- sudo pip install virtualenv 
	- virtualenv venv 
	- . venv/bin/activate
	- pip install -r requirements.txt
	- gunicorn -k flask_sockets.worker server:app
2. Go to chrome://extensions/ and click on the 'Options' link for this extension
3. Grant access to your webcam
4. Back at chrome://extensions/ click the 'Reload' link for this extension

### Cheat Sheet

- Yourself = Local webcam (best video quality, will ask permission on every page load)
- I'm Feeling Lucky = Webcam Roulette over the server (local only ATM)
- A Cat = A Cat
- Free Money = Rickroll
- Chill Vibes = Darude's Sandstorm
- Off = Yeah.