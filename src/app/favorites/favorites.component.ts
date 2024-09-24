import { Component, inject } from '@angular/core';
import { FlickrImage, FlickrImageBase } from '../flickr-image';
import { SettingsService } from '../settings.service';
import { FlickrService } from '../flickr.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ImageGridComponent } from '../image-grid/image-grid.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ImageGridComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  settingsService: SettingsService = inject(SettingsService);
  flickrService: FlickrService = inject(FlickrService);
  imageBases: FlickrImageBase[] = [];

  images: FlickrImage[] = [];
  subscriptions:Subscription[] = [];


  /**
   * Kép URL-jének lekérése
   * @param image
   * @returns 
   */
  getSrcOfImage(image: FlickrImageBase) {
    return this.flickrService.getSrcOfImage(image.server, image.id, image.secret);
  }

  ngOnInit() {
    this.imageBases = this.settingsService.getFavorites();
    this.imageBases.forEach(imgb => {
      this.subscriptions.push(
        this.flickrService.getInfoOfImage(imgb.id, imgb.secret).subscribe(img => 
          {
            this.images.push(img);
            this.images = this.images.slice();
          }

        )
      );
    });
  }


}
