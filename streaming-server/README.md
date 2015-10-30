to install:
```
        - cd streaming-server
        - sudo pip install virtualenv
        - virtualenv venv
        - . venv/bin/activate
        - pip install -r requirements.txt
        - gunicorn -k flask_sockets.worker server:app
