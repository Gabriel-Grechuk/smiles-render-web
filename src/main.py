from waitress import serve
from dotenv import load_dotenv
from routes import app
import os
from os import getenv


load_dotenv()


def main():
    host = "0.0.0.0"
    port = getenv("PORT") or 3000
    print(f"smiles-render-web running at {host}:{port}")
    serve(app, host=host, port=port, threads=os.cpu_count() or 1)


if __name__ == "__main__":
    main()
