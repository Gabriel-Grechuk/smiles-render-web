from flask import Flask, request, send_file
from converter import convert_smiles

app = Flask(__name__)


@app.route("/ping")
def ping():
    return "pong"


@app.route("/")
def index():
    return """
    <html>
        <head>
            <title>SMILES render</title>
        </head>
        <body>
            <h1>Coming soon!</h1>
        </body>
    </html>
    """


@app.route("/render/<string:smiles>")
def render_smiles(smiles: str):
    try:
        format = request.args.get("format") or "png"
        image = convert_smiles(smiles, format.lower())

        return send_file(image, f"image/{format}")

    except Exception as err:
        print(err)
        return f"Could not convert smiles: {err}"
