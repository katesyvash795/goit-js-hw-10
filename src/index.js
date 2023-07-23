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
function showElement(...elems) {
  elems.forEach(i => i.classList.remove('hidden'));
}

function onLoad() {
  fetchBreeds('/breeds')
    .then(data => {
      refs.selectBreedEl.innerHTML = createMarkupSelect(data);
      new SlimSelect({
        select: '.breed-select',
      });
      hideElement(refs.loaderEl, refs.selectBreedEl);
    })
    .catch(() =>
      Notify.failure('Oops! Something went wrong! Try reloading the page!')
    );
}

function onSelect(evt) {
  hideElement(refs.breedInfoEl); // Скрываем элемент div.cat-info перед отправкой запроса
  showElement(refs.loaderEl); // Показываем элемент p.loader во время выполнения запроса

  fetchCatByBreed('images/search', evt.target.value)
    .then(resp => {
      refs.breedInfoEl.innerHTML = createMarkupInfo(resp[0]);
      refs.breedInfoEl.style.display = 'flex';
      refs.breedInfoEl.style.gap = '20px';
      hideElement(refs.loaderEl); // Скрываем элемент p.loader после получения ответа
    })
    .catch(() => {
      Notify.failure('Упс! Что-то пошло не так! Попробуйте обновить страницу!');
      hideElement(refs.loaderEl); // Скрываем элемент p.loader в случае ошибки
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