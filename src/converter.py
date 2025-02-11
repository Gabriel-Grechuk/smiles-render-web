from io import BytesIO
from rdkit import Chem
from rdkit.Chem import Draw
import zipfile
import re


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
    return re.sub(r"[^a-zA-Z0-9]", "", name).lower()


def valid_format(format: str) -> bool:
    return format.upper() in supported_formats


def convert_smiles(smiles: str, format: str) -> BytesIO:
    if not valid_format(format):
        raise Exception(f"Format {format.upper()} not supported.")

    molecule = Chem.MolFromSmiles(smiles)
    image = Draw.MolToImage(molecule)

    image = image.convert("RGBA")
    data = image.getdata()
    new_data = []
    for item in data:
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    image.putdata(new_data)

    bin_image = BytesIO()
    image.save(bin_image, format.upper())
    bin_image.seek(0)

    return bin_image


def convert_many_smiles_and_zip(smiles: list[tuple[str, str, str]]) -> BytesIO:
    zip_file = BytesIO()

    used_names_cout: dict[str, int] = {}

    with zipfile.ZipFile(zip_file, "w") as zip:
        for smile, name, format in smiles:
            format = format if valid_format(format) else "png"
            image = convert_smiles(smile, format)

            if not name:
                name = sanitize_file_name(smile)

            if name in list(used_names_cout):
                used_names_cout[name] += 1
                name = f"{name} {used_names_cout[name]}"

            used_names_cout[name] = 1

            zip.writestr(f"{name}.{format.lower()}", image.getvalue())

    zip_file.seek(0)

    return zip_file
