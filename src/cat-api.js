import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_H24JXYBVrrM9Zqd0AhOom07voavPNPg9MNCpoSpk17G91i6mXMnj02i3p6IfEKdP';
axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';

const endPoint = 'breeds'; // Змінна зі сталою величиною для URL

export function fetchBreeds() {
  return axios.get(endPoint).then(data => {
    return data.data;
  });
}

export function fetchCatByBreed(breedId) {
  const catByBreed = `${endPoint}/${breedId}`; // Використання змінної endPoint
  return axios.get(catByBreed).then(resp => {
    return resp.data;
  });
}
