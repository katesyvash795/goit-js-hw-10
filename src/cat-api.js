import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_0AUTe1rdtPbkwAintnktfaswtDRd2q3eYxXu5ywHbfzBuQ6yGBUeqoZzeCK7pBJX';
axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';

export function fetchBreeds(endPoint) {
  return axios.get(endPoint)
    .then(data => {
      return data.data;
    })
    .catch(error => {
      console.error('Error fetching breeds:', error);
      throw error; // Пробрасываем ошибку дальше, чтобы ее можно было обработать в коде вызывающего компонента или функции.
    });
}

export function fetchCatByBreed(endPoint, breedId) {
  const catByBreed = endPoint + '?breed_ids=' + breedId;
  return axios.get(catByBreed)
    .then(resp => {
      return resp.data;
    })
    .catch(error => {
      console.error('Error fetching cat by breed:', error);
      throw error; // Пробрасываем ошибку дальше, чтобы ее можно было обработать в коде вызывающего компонента или функции.
    });
}
