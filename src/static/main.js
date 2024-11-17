function fetchImage() {
  const inputString = document.getElementById('inputString').value;
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = 'Loading...';

  fetch(`/render/${inputString}`, {
    method : 'GET',
  })
      .then(response => {
        if (!response.ok)
          throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        imageContainer.innerHTML =
            `<img src="${imageUrl}" alt="Returned Image">`;
      })
      .catch(error => {
        console.error('Error:', error);
        imageContainer.innerHTML = 'Failed to load image';
      });
}
