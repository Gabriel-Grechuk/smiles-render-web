from io import BytesIO
from rdkit import Chem
from rdkit.Chem import Draw
import zipfile
import re
from tools import micro_hash
from os import path


supported_formats = [
    "BLP",
    "BMP",
    "DDS",
    "DIB",
    "EPS",
    "GIF",
    "ICNS",
    "ICO",
    "IM",
    "JPEG",
    "MSP",
    "PCX",
    "PFM",
    "PNG",
    "PPM",
    "TIFF",
    "WEBP",
    "XBM",
]


def sanitize_file_name(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]", "", name).lower() + "_" + micro_hash(name)


def valid_format(format: str) -> bool:
    return format.upper() in supported_formats


def convert_smiles(smiles: str, format: str) -> BytesIO:
    if not valid_format(format):
        raise Exception(f"Format {format.upper()} not supported.")

    molecule = Chem.MolFromSmiles(smiles)
    image = Draw.MolToImage(molecule)
    bin_image = BytesIO()
    image.save(bin_image, format.upper())
    bin_image.seek(0)

    return bin_image


def convert_many_smiles_and_zip(smiles: list[tuple[str, str]]) -> BytesIO:
    zip_file = BytesIO()

    with zipfile.ZipFile(zip_file, "w") as zip:
        for smile, format in smiles:
            image = convert_smiles(smile, format)
            zip.writestr(
                f"{sanitize_file_name(smile)}.{format.lower()}", image.getvalue()
            )
    zip_file.seek(0)

    return zip_file


def convert_many_named_smiles_and_zip(smiles: list[tuple[str, str]]) -> BytesIO:
    zip_file = BytesIO()

    already_assigned_names: list[str] = []

    with zipfile.ZipFile(zip_file, "w") as zip:
        for smile, name in smiles:
            name = name.lower()

            original_format = path.splitext(name)[1].replace(".", "")
            format = original_format if valid_format(original_format) else "png"

            name = name.replace(original_format, format)

            if name in already_assigned_names:
                name = "duplicated-" + name

            already_assigned_names.append(name)

            image = convert_smiles(smile, format)
            zip.writestr(f"{name}", image.getvalue())
    zip_file.seek(0)

    return zip_file
