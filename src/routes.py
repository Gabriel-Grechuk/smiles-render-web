import base64
from io import TextIOWrapper
from flask import Flask, render_template, request, send_file
from converter import (
    convert_many_smiles_and_zip,
    convert_smiles,
)
from tools import read_csv
from base64 import b64decode


app = Flask(__name__)


@app.route("/ping")
def ping():
    return "pong", 200


@app.route("/")
def index():
    return render_template("index.html")


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
            smiles_to_convert: list[tuple[str, str, str]] = []
            registered_smiles: list[str] = []

            for item in smiles:
                if type(item) == str:
                    if not item in registered_smiles:
                        smiles_to_convert.append((item, "", format))
                        registered_smiles.append(item)

                elif type(item) == dict:
                    if not item["smiles"]:
                        print("No smiles found... It will be ignored")
                        continue

                    smiles_to_convert.append(
                        (item["smiles"], "", item["format"] or format)
                    )

                else:
                    print("This item have a invalid type... It will be ignored")

            zip_file = convert_many_smiles_and_zip(smiles_to_convert)
            return (
                send_file(
                    zip_file,
                    mimetype="application/zip",
                    as_attachment=True,
                    download_name="smiles_images.zip",
                ),
                200,
            )

        return "Ok", 200

    except Exception as err:
        print(err)
        return f'Could not convert smiles: "{err}"', 412


@app.route("/render/<string:smiles>", methods=["GET"])
def render_smiles(smiles: str):
    try:
        print(smiles)
        format = request.args.get("format") or "png"
        image = convert_smiles(smiles, format.lower())

        return send_file(image, f"image/{format}"), 200

    except Exception as err:
        print(err)
        return f'Could not convert smiles: "{err}"', 412


@app.route("/render/csv", methods=["POST"])
def render_by_csv():
    try:
        input = request.files["csv"]
        if not input or input.filename == "":
            return "No csv file in payload", 400

        smiles_column = request.form.get("smiles_column")
        names_column = request.form.get("names_column")
        delimiter = request.form.get("delimiter") or ","
        format = request.form.get("format") or "png"
        file = TextIOWrapper(input.stream, encoding="utf-8")

        if not smiles_column:
            return "Smiles column is not defined", 400

        data = list(
            map(
                lambda data: data + (format,),
                read_csv(
                    file=file,
                    smiles_column=smiles_column,
                    names_column=names_column,
                    delimiter=delimiter,
                ),
            )
        )

        zip_file = convert_many_smiles_and_zip(data)
        return (
            send_file(
                zip_file,
                mimetype="application/zip",
                as_attachment=True,
                download_name="smiles_images.zip",
            ),
            200,
        )

    except Exception as err:
        print(err)
        return f'Could not convert smiles: "{err}"', 412


@app.route("/render/base64/<string:smiles>", methods=["GET"])
def render_base64_smiles(smiles: str):
    try:
        decoded_smiles = b64decode(smiles.encode("utf-8")).decode("utf-8")
        format = request.args.get("format") or "png"
        image = convert_smiles(decoded_smiles, format.lower())

        return send_file(image, f"image/{format}"), 200

    except Exception as err:
        print(err)
        return f'Could not convert smiles: "{err}"', 412
