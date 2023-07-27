import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const bodyEl = document.querySelector('body');

const refs = {
  selectBreedEl: findRef(bodyEl.children, 'breed-select'),
  loaderEl: findRef(bodyEl.children, 'wrapper-loader'),
  errorEl: findRef(bodyEl.children, 'error'),
  breedInfoEl: findRef(bodyEl.children, 'cat-info'),
};

hideElement(refs.errorEl, refs.selectBreedEl);

window.addEventListener('load', onLoad);
refs.selectBreedEl.addEventListener('change', onSelect);

function onLoad() {
  hideElement(refs.errorEl, refs.selectBreedEl);

  // Скрыть cat-info и показать loader во время загрузки данных
  hideElement(refs.breedInfoEl);
  refs.loaderEl.classList.remove('hidden');

  fetchBreeds('/breeds')
    .then(data => {
      refs.selectBreedEl.innerHTML = createMarkupSelect(data);
      new SlimSelect({
        select: '.breed-select',
      });

      // Скрыть loader и показать cat-info после успешной загрузки данных
      hideElement(refs.loaderEl);
      refs.breedInfoEl.classList.remove('hidden');
    })
    .catch(() => {
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
      hideElement(refs.loaderEl); // Скрыть loader после вывода ошибки
    });
}

function onSelect(evt) {
  // Скрыть cat-info и показать loader во время загрузки данных
  hideElement(refs.breedInfoEl);
  refs.loaderEl.classList.remove('hidden');

  fetchCatByBreed('images/search', evt.target.value)
    .then(resp => {
      refs.breedInfoEl.innerHTML = createMarkupInfo(resp[0]);
      refs.breedInfoEl.style.display = 'flex';
      refs.breedInfoEl.style.gap = '20px';

      // Скрыть loader и показать cat-info после успешной загрузки данных
      hideElement(refs.loaderEl);
      refs.breedInfoEl.classList.remove('hidden');
    })
    .catch(() => {
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
      hideElement(refs.loaderEl); // Скрыть loader после вывода ошибки
    });
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
