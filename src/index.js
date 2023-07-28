import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const bodyEl = document.querySelector('body');

const refs = {
  selectBreedEl: findRef(bodyEl.children, 'breed-select'),
  loaderEl: findRef(bodyEl.children, 'wrapper-loader'),
  errorEl: document.querySelector('.error'),
  breedInfoEl: findRef(bodyEl.children, 'cat-info'),
};
console.log(refs.errorEl);
hideElement(refs.errorEl, refs.selectBreedEl);

window.addEventListener('load', onLoad);
refs.selectBreedEl.addEventListener('change', onSelect);
function onLoad() {
  hideElement(refs.errorEl, refs.selectBreedEl);

  
  hideElement(refs.breedInfoEl);
  refs.loaderEl.classList.remove('hidden');
  refs.selectBreedEl.classList.add('hidden');
  refs.breedInfoEl.classList.add('hidden'); 

  fetchBreeds('/breeds')
    .then(data => {
      refs.selectBreedEl.innerHTML = createMarkupSelect(data);
      new SlimSelect({
        select: '.breed-select',
      });

      
      hideElement(refs.loaderEl);
      refs.breedInfoEl.classList.remove('hidden'); 
      refs.selectBreedEl.classList.remove('hidden');
    })
    .catch(() => {
      hideElement(refs.loaderEl); 
      refs.selectBreedEl.classList.remove('hidden');
    });
}

function onSelect(evt) {
  
  refs.breedInfoEl.innerHTML = ''; 
  hideElement(refs.breedInfoEl);
  refs.loaderEl.classList.remove('hidden');
  refs.selectBreedEl.classList.add('hidden');
  refs.breedInfoEl.classList.add('hidden'); 

  fetchCatByBreed('images/search', evt.target.value)
    .then(resp => {
      refs.breedInfoEl.innerHTML = createMarkupInfo(resp[0]);
      refs.breedInfoEl.style.display = 'flex';
      refs.breedInfoEl.style.gap = '20px';

    
      hideElement(refs.loaderEl);
      refs.breedInfoEl.classList.remove('hidden'); 
      refs.selectBreedEl.classList.remove('hidden');
    })
    .catch(() => {
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
      hideElement(refs.loaderEl);
      refs.selectBreedEl.classList.remove('hidden');
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