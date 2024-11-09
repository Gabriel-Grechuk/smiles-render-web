# smiles-render-web

Online tool to help creating images from molecule SMILES.


## Running the API

### Docker compose

#### Requirements

- `docker`
- `docker compose`

#### Running

``` bash
    docker compose up
```

now you can check if the API is running by performing a `GET` in [localhost:3000/ping](http://localhost:3000/ping)

### Local

#### Requirements

- `mise`

#### Running

``` bash
    # Edit .env:
    cp .env.example .env
    vim .env

    # Install the correct python version and dependencies:
    mise install
    python3 -m venv .venv
    pip install -r requirements.txt

    # Running the API
    python3 src/main.py
```

now you can check if the API is running by performing a `GET` in [localhost:3000/ping](http://localhost:3000/ping)