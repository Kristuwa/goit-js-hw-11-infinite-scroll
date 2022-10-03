import './css/styles.css';
// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ServiceApi } from './news-api';
import Notiflix from 'notiflix';
import InfiniteScroll from 'infinite-scroll';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = {
  form: document.querySelector('.search-form'),
  buttonSubmit: document.querySelector('[data-type="submit"]'),
  //   button: document.querySelector('.load-more'),
  galleryList: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearch);
// refs.button.addEventListener('click', onLoadMoreImg);
let infiniteScroll = new InfiniteScroll(refs.galleryList, {
  path: function () {
    return `https://pixabay.com/api/?key=30242343-f6d10ec55d07081d5dcce6a52&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.pageIndex}`;
  },
  responseBody: 'json',
  status: '.scroll-status',
  history: false,
});

function onSearch(e) {
  e.preventDefault();
  clearGallery();

  infiniteScroll.pageIndex = 1;
  infiniteScroll.query = e.currentTarget.elements.searchQuery.value.trim();

  if (infiniteScroll.query === '') {
    return Notiflix.Notify.failure('Please enter valid name.');
  }

  infiniteScroll.on('load', listener);

  infiniteScroll.loadNextPage();
}

function listener({ totalHits, hits }, response) {
  console.log({ totalHits, hits });

  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const maxPage = totalHits / 40;
  const currentPage = infiniteScroll.pageIndex - 1;
  console.log(currentPage);
  if (currentPage === 1) {
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  }

  if (maxPage <= currentPage) {
    animalsMarkup(hits);
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );

    infiniteScroll.of('load', listener);
    return;
  }

  return animalsMarkup(hits);
}

function animalsMarkup(data) {
  refs.galleryList.insertAdjacentHTML('beforeend', galleryItem(data));
  lightbox.refresh();
}

function galleryItem(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery-item" href="${largeImageURL}">
		 <div class="photo-card">
		  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="320" height="214"/>
		  <div class="info"><p class="info-item">
		  <b>Likes:</b> ${likes}
		</p>
		<p class="info-item">
		  <b>Views:</b> ${views}
		</p>
		<p class="info-item">
		  <b>Comments:</b> ${comments}
		</p>
		<p class="info-item">
		  <b>Downloads:</b> ${downloads}
		</p>
	 </div></div></a>`;
      }
    )
    .join('');
  return markup;
}

function clearGallery() {
  refs.galleryList.innerHTML = '';
}
