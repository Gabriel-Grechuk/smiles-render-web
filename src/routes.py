from flask import Flask

app = Flask(__name__)


@app.route("/ping")
def ping():
    return "pong"


@app.route("/")
def index():
    return """
    <html>
        <head>
            <title>Hey there</title>
        </head>
        <body>
            <h1>Hey there!</h1>
        </body>
    </html>
    """
