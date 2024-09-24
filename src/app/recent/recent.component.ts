import { Component, inject } from '@angular/core';
import { ImageGridComponent } from '../image-grid/image-grid.component';
import { FlickrService } from '../flickr.service';
import { FlickrImage } from '../flickr-image';

@Component({
  selector: 'app-recent',
  standalone: true,
  imports: [ImageGridComponent],
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.css'
})
export class RecentComponent {
  
  flickrService : FlickrService = inject(FlickrService);

  images : FlickrImage[] = [];

  /**
   * Adatok lekérése
   */
  getRecent() {
    this.flickrService.getRecent().subscribe(res => {
      this.images = res;
    });
  }

  ngOnInit() {
    this.getRecent();
  }
}
