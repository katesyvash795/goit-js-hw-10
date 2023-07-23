import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const bodyEl = document.querySelector('body');

const refs = {
  selectBreedEl: document.querySelector('.breed-select'),
  loaderEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
  breedInfoEl: document.querySelector('.cat-info'),
};

hideElement(refs.errorEl, refs.selectBreedEl);

window.addEventListener('load', onLoad);
refs.selectBreedEl.addEventListener('change', onSelect);

function onLoad() {
  // Показати елемент завантаження під час отримання даних
  hideElement(refs.selectBreedEl, refs.errorEl);
  refs.loaderEl.classList.remove('hidden'); // Видалення класу 'hidden', щоб показати елемент завантаження

  fetchBreeds('/breeds')
    .then(data => {
      refs.selectBreedEl.innerHTML = createMarkupSelect(data);
      new SlimSelect({
        select: '.breed-select',
      });
      hideElement(refs.loaderEl); // Приховати елемент завантаження після успішного отримання даних
    })
    .catch(() =>
      Notify.failure('Oops! Something went wrong! Try reloading the page!')
    );
}

function onSelect(evt) {
  // Показати елемент завантаження під час отримання даних
  hideElement(refs.breedInfoEl);
  refs.loaderEl.classList.remove('hidden'); // Видалення класу 'hidden', щоб показати елемент завантаження

  fetchCatByBreed('images/search', evt.target.value)
    .then(resp => {
      refs.breedInfoEl.innerHTML = createMarkupInfo(resp[0]);
      refs.breedInfoEl.style.display = 'flex';
      refs.breedInfoEl.style.gap = '20px';
      hideElement(refs.loaderEl); // Приховати елемент завантаження після успішного отримання даних
    })
    .catch(() =>
      Notify.failure('Oops! Something went wrong! Try reloading the page!')
    );
}

function createMarkupSelect(arr) {
  return (
    '<option value="" disabled selected>Choose your cat...</option>' +
    arr.map(({ id, name }) => `<option value=${id}>${name}</option>`).join('')
  );
}

function createMarkupInfo({ url, breeds }) {
  const { name, temperament, description } = breeds[0];
  return `<img src="${url}" alt="${name}" width = 450>
      <div><h2>Breed: ${name}</h2>
      <h3>Temperament: ${temperament}</h3>
      <h4>Description</h4>
      <p>${description}</p></div>`;
}

function hideElement(...elems) {
  elems.forEach(i => i.classList.toggle('hidden'));
}

function findRef(queryEl, classN) {
  return [...queryEl].find(i => i.className === classN);
}
