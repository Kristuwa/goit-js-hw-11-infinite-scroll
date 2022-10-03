import axios from 'axios';

const API_KEY = '30242343-f6d10ec55d07081d5dcce6a52';
const BASE_URL = 'https://pixabay.com/api';

export class ServiceApi {
  constructor() {
    this.page = 1;
    this.perPage = 40;
    this.searchQuery = '';
    this.axios = require('axios');
  }

  async fetchAnimals() {
    try {
      const response = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`
      );
      const data = response.data;
      this.incrementPage();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
