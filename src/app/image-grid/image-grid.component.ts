import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlickrImage, FlickrImageBase } from '../flickr-image';
import { SettingsService } from '../settings.service';

/**
 *Egy kép táblázatot reprezentáló komponens
 *
 * @export
 * @class ImageGridComponent
 */
@Component({
  selector: 'app-image-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './image-grid.component.html',
  styleUrl: './image-grid.component.css'
})
export class ImageGridComponent {

  //KÉPEK
  private _images: FlickrImage[] = [];

  @Input() set images(value: FlickrImage[]) {
    this._images = value;
    this.imageTable = [];
    for (let i = 0; i < value.length; i += 3)
      this.imageTable.push(value.slice(i, i + 3));
  }

  @Input() loading: boolean = false;

  activeImageIndex: number | null = null;
  settingsService: SettingsService = inject(SettingsService);

  imageTable: FlickrImage[][] = [];


  /**
   *Egy kép kedvenc kapcsolója (ki és be)
   *
   * @param {FlickrImageBase} image Adott kép
   * @param {MouseEvent} e
   * @memberof ImageGridComponent
   */
  switchFavorite(image: FlickrImageBase, e: MouseEvent) {
    e.stopPropagation();
    this.settingsService.switchFavorite(image);
  }

  /**
   *Kép id ellenőrzése, hogy már kedvenc-e
   *
   * @param {bigint} id
   * @return {*} 
   * @memberof ImageGridComponent
   */
  hasFavorite(id: bigint) {
    return this.settingsService.hasFavorite(id);
  }

  /**
   * Kép megjelenítése
   * @param image 
   */
  showImage(image: FlickrImage) {
    this.activeImageIndex = this._images.indexOf(image);
  }

  /**
   *  Épp mutatott kép lekérése
   * @returns 
   */
  getShownImage(): FlickrImage | null {
    if (this.activeImageIndex === null)
      return null;

    return this._images[this.activeImageIndex];
  }

  /**
   * Követekező kép megjelenítése előtérben
   * @param e Event
   */
  next(e: MouseEvent) {
    e.stopPropagation();
    this.activeImageIndex = Math.min(this._images.length-1, this.activeImageIndex!+1);
  }

  /**
   * Előző kép megjelenítése az előtérben
   * @param e 
   */
  prev(e: MouseEvent) {
    e.stopPropagation();
    this.activeImageIndex = Math.max(0, this.activeImageIndex!-1);
  }
  
  /**
   * Előtérben megnyitott kép bezárása
   */
  quitDetails() {
    this.activeImageIndex = null;
  }
}
