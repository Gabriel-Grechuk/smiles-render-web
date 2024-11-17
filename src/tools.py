import hashlib
import csv
from io import TextIOWrapper


def micro_hash(input: str):
    hash_object = hashlib.sha1(input.encode())
    short_hash = int.from_bytes(hash_object.digest()[:3], "big")

    base62_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    base62_hash = ""

    for _ in range(4):
        base62_hash = base62_chars[short_hash % 62] + base62_hash
        short_hash //= 62

    return base62_hash


def read_csv(
    file: TextIOWrapper,
    delimiter: str,
    smiles_column: str,
    names_column: str | None = None,
) -> list[tuple[str, str]]:
    csv_data = csv.DictReader(file, delimiter=delimiter)

    if not csv_data:
        raise Exception("Could not read csv file")

    if csv_data.fieldnames is not None:
        if smiles_column not in csv_data.fieldnames:
            raise Exception(f"{smiles_column} column not found")
        if names_column is not None:
            if names_column not in csv_data.fieldnames:
                raise Exception(f"{names_column} column not found")
    else:
        raise Exception("Could not read csv file")

    smiles: list[str] = []
    names: list[str] = []

    for row in csv_data:
        smiles.append(row[smiles_column].strip())
        if names_column:
            names.append(row[names_column].strip())
        else:
            names.append("png")

    return list(zip(smiles, names))
