function renderImages() {
  const inputStrings =
      document.getElementById('smiles-input-string').value.split('\n');
  const imagesContainer = document.getElementById('rendered-images');

  imagesContainer.innerHTML = '';

  for (const smiles of inputStrings) {
    const node = document.createElement('div');
    node.className = 'smiles-image';

    const image = document.createElement('img');
    image.setAttribute('src', `/render/${smiles}`);
    image.setAttribute('alt', smiles);

    const desc = document.createElement('p');
    desc.innerHTML = smiles;

    node.appendChild(image);
    node.appendChild(desc);
    imagesContainer.appendChild(node);
  }
}

function downloadImages() {
  const inputStrings =
      document.getElementById('smiles-input-string').value.split('\n');

  fetch('/render', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({format: 'png', smiles: inputStrings})
  })
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not get response from network');
        }
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'smiles.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(error => { console.error('Error downloading the file:', error); });
}
