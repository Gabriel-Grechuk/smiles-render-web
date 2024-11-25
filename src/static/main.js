function renderImages() {
  const inputStrings = document
    .getElementById("smiles-input-string")
    .value.split("\n");
  const imagesContainer = document.getElementById("rendered-images");

  imagesContainer.innerHTML = "";

  for (const smiles of inputStrings) {
    const node = document.createElement("div");
    node.className = "smiles-image";

    const image = document.createElement("img");
    image.setAttribute(
      "src",
      `/render/base64/${encodeURIComponent(window.btoa(smiles))}`,
    );
    image.setAttribute("alt", smiles);

    const desc = document.createElement("p");
    desc.innerHTML = smiles;

    node.appendChild(image);
    node.appendChild(desc);
    imagesContainer.appendChild(node);
  }
}

function downloadImages() {
  const inputStrings = document
    .getElementById("smiles-input-string")
    .value.split("\n");

  fetch("/render", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ format: "png", smiles: inputStrings }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not get response from network");
      }
      return response.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "smiles.zip";
      document.body.appendChild(link);
      11;
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading the file:", error);
    });
}

function parseCSV(text, delimiter) {
  const lines = text.split("\n");
  const columns = [];
  for (const line of lines) columns.push(line.split(delimiter));
  return columns;
}

function getCSVColumn(csvData, name) {
  const index = csvData[0].indexOf(name);
  if (index === -1) return [];

  return csvData
    .map((row) => row[index])
    .filter((cell) => {
      if (cell === name) return null;
      return cell;
    });
}

function zip(arr1, arr2) {
  return arr1.map((element, i) => [element, arr2[i]]);
}

function renderFromCSV() {
  const [csvFile] = document.getElementById("csv-file").files;
  const csvSmilesColumn = document.getElementById("csv-smiles-column").value;
  const csvNamesColumn = document.getElementById("csv-names-column").value;
  const csvDelimiter = document.getElementById("csv-delimiter").value || ",";

  if (!csvFile) {
    console.error("CSV file should be selected");
    document.getElementById("csv-file-error").innerHTML = "*Select a CSV file";
    return 1;
  }

  if (!csvSmilesColumn) {
    console.error("No name for smiles column in CSV");
    document.getElementById("csv-smiles-column-error").innerHTML =
      "*Required smiles column name";
    return 1;
  }

  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      const csvContent = parseCSV(reader.result, csvDelimiter);
      const smiles = getCSVColumn(csvContent, csvSmilesColumn);
      const imagesContainer = document.getElementById("csv-rendered-images");
      imagesContainer.innerHTML = "";

      if (csvNamesColumn) {
        const names = getCSVColumn(csvContent, csvNamesColumn);

        for (const [molecule, name] of zip(smiles, names)) {
          const node = document.createElement("div");
          node.className = "smiles-image";

          const image = document.createElement("img");
          image.setAttribute(
            "src",
            `/render/base64/${encodeURIComponent(window.btoa(molecule))}`,
          );
          image.setAttribute("alt", smiles);

          const desc = document.createElement("p");
          desc.innerHTML = name;

          node.appendChild(image);
          node.appendChild(desc);
          imagesContainer.appendChild(node);
        }
      } else {
        for (const molecule of smiles) {
          const node = document.createElement("div");
          node.className = "smiles-image";

          const image = document.createElement("img");
          image.setAttribute(
            "src",
            `/render/base64/${encodeURIComponent(window.btoa(molecule))}`,
          );
          image.setAttribute("alt", smiles);

          const desc = document.createElement("p");
          desc.innerHTML = molecule;

          node.appendChild(image);
          node.appendChild(desc);
          imagesContainer.appendChild(node);
        }
      }
    },
    false,
  );
  reader.readAsText(csvFile);
}

function resetErrosElements(ids) {
  for (const id of ids) document.getElementById(id).innerHTML = "";
}

function downloadFromCSV() {
  resetErrosElements(["csv-file-error", "csv-smiles-column-error"]);

  const [csvFile] = document.getElementById("csv-file").files;
  const csvSmilesColumn = document.getElementById("csv-smiles-column").value;
  const csvNamesColumn = document.getElementById("csv-names-column").value;
  const csvFormat = document.getElementById("csv-format").value;
  const csvDelimiter = document.getElementById("csv-delimiter").value;

  if (!csvFile) {
    console.error("CSV file should be selected");
    document.getElementById("csv-file-error").innerHTML = "*Select a CSV file";
    return 1;
  }

  if (!csvSmilesColumn) {
    console.error("No name for smiles column in CSV");
    document.getElementById("csv-smiles-column-error").innerHTML =
      "*Required smiles column name";
    return 1;
  }

  const form = new FormData();
  form.append("csv", csvFile);
  form.append("smiles_column", csvSmilesColumn);
  if (csvNamesColumn) form.append("names_column", csvNamesColumn);
  if (csvDelimiter) form.append("delimiter", csvDelimiter);
  if (csvFormat) form.append("format", csvFormat);

  fetch("/render/csv", {
    method: "POST",
    body: form,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not get response from network");
      }
      return response.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "smiles.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch((err) => console.error(err));
}
