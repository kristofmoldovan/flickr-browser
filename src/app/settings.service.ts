import { Injectable } from '@angular/core';
import { FlickrImageBase } from './flickr-image';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiKey: string ="";
  private favorites: FlickrImageBase[] = [];

  constructor() {
    this.loadApiKey();
    this.loadFavorites();
  }

  /**
   * API kulcs betöltése storageból
   */
  loadApiKey() {
    let tmp: string | null = localStorage.getItem('apiKey');
    if (tmp !== null) {
      this.apiKey = JSON.parse(tmp);
    } else {
      this.apiKey = "";
    }
  }


  /**
   * 
   * @param key API kulcs beállítása és mentése
   */
  setApiKey(key: string) {
    if (key) {
      this.apiKey = key;

      localStorage.setItem('apiKey', JSON.stringify(this.apiKey));
    }
  }

  /**
   * Api kulcs getter 
   * @returns api kulcs
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Mentett kedvenc képek betöltése
   */
  loadFavorites() {
    let tmp: string | null = localStorage.getItem('favs');
    if (tmp !== null) {
      this.favorites = JSON.parse(tmp);
    } else {
      this.favorites = [];
    }
  }

  /**
   * Kedvenck képek elmentése local storage-be
   */
  saveFavorites() {
    localStorage.setItem('favs', JSON.stringify(this.favorites));
  }

  private addToFavorites(image: FlickrImageBase) {
    this.favorites.push({id: image.id, secret: image.secret, server: image.server, farm: image.farm});
  }

  /**
   * 
   * @returns Kedvenc képek lekérése
   */
  getFavorites() {
    return this.favorites;
  }

  /**
   * Kép ID-jének ellenőrzése, hogy kedvenc-e
   * @param id Kép id-je
   * @returns 
   */
  hasFavorite(id: bigint) {
    return this.favorites.find( item => item.id == id) ?? false;
  }

  /**
   * Kép kedvenc kapcsolója
   * @param image Kép
   */
  switchFavorite(image: FlickrImageBase) {
    let index = this.favorites.findIndex(item => item.id == image.id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.addToFavorites(image);
      this.saveFavorites();
    }
  }


}
