import hashlib


def micro_hash(input: str):
    hash_object = hashlib.sha1(input.encode())
    short_hash = int.from_bytes(hash_object.digest()[:3], "big")

    base62_chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    base62_hash = ""

    for _ in range(4):
        base62_hash = base62_chars[short_hash % 62] + base62_hash
        short_hash //= 62

    return base62_hash
