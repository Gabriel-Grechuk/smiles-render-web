from io import BytesIO
from logging import exception
from rdkit import Chem
from rdkit.Chem import Draw

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
