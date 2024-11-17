from flask import Flask, request, send_file
from converter import convert_many_smiles_and_zip, convert_smiles

app = Flask(__name__)


@app.route("/ping")
def ping():
    return "pong", 200


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


@app.route("/render", methods=["POST"])
def render_by_json():
    try:
        data = request.get_json()
        format: str = data["format"] or "png"
        smiles = data["smiles"]

        if not smiles:
            return 'Invalid request! The payload should contain a "smiles" field!', 412

        elif type(smiles) == str:
            image = convert_smiles(smiles, format.lower())
            return send_file(image, f"image/{format}"), 200

        if type(smiles) == list:
            smiles_to_convert: list[tuple[str, str]] = []
            registered_smiles: list[str] = []

            for item in smiles:
                if type(item) == str:
                    if not item in registered_smiles:
                        smiles_to_convert.append((item, format))
                        registered_smiles.append(item)

                elif type(item) == dict:
                    if not item["smiles"]:
                        print("No smiles found... It will be ignored")
                        continue

                    smiles_to_convert.append((item["smiles"], item["format"] or format))

                else:
                    print("This item have a invalid type... It will be ignored")

            zip_file = convert_many_smiles_and_zip(smiles_to_convert)
            return send_file(
                zip_file,
                mimetype="application/zip",
                as_attachment=True,
                download_name="smiles_images.zip",
            )

        return "Ok", 200

    except Exception as err:
        print(err)
        return f'Could not convert smiles: "{err}"', 412


@app.route("/render/<string:smiles>", methods=["GET"])
def render_smiles(smiles: str):
    try:
        format = request.args.get("format") or "png"
        image = convert_smiles(smiles, format.lower())

        return send_file(image, f"image/{format}"), 200

    except Exception as err:
        print(err)
        return f'Could not convert smiles: "{err}"', 412


@app.route("/render/csv", methods=["POST"])
def render_by_csv():
    return "Coming soon!"
