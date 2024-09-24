import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImageGridComponent } from '../image-grid/image-grid.component';
import { FlickrImage, FlickrImageBase } from '../flickr-image';
import { FlickrService } from '../flickr.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { routes } from '../app.routes';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [ImageGridComponent, RouterModule, CommonModule, MatButtonModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {

  flickrService: FlickrService = inject(FlickrService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  tag: string = "";

  images: FlickrImage[] = [];
  relTags: string[] = [];

  relatedTagsSub: Subscription | null = null;
  imagesSub: Subscription | null = null;

  loading = true;

  constructor() {
    this.tag = this.route.snapshot.params['tag'] ?? "";
  }

  /**
   * Adatok lekérése
   */
  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.tag = params['tag'];

      this.loading = true;

      this.imagesSub?.unsubscribe();
      this.relatedTagsSub?.unsubscribe();

      this.relatedTagsSub = this.flickrService.getRelatedTags(this.tag).subscribe(
        tags => {this.relTags = tags.slice(0, 8);}
      );


      this.imagesSub = this.flickrService.getPhotosSearch({tags: this.tag}).subscribe(
        img => {this.images = img; this.loading = false;}
      );
    });

    

  }
}
