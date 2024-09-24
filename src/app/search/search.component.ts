import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FlickrService } from '../flickr.service';
import { Subscription, first } from 'rxjs';
import { FlickrImage } from '../flickr-image';
import { MatButtonModule } from '@angular/material/button';
import { ImageGridComponent } from '../image-grid/image-grid.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, ImageGridComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  flickrService: FlickrService = inject(FlickrService);

  loading = true;

  text: string;
  words: string[] = [];

  foundUserId: string | null = null;
  images: FlickrImage[] = [];

  userSub: Subscription | null = null;
  imagesSub: Subscription | null = null;


 
  constructor() {
    this.text = this.route.snapshot.params['text'] ?? "";
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.text = params['text'];
      this.getData();
    });
    
  }

  /**
   * Adatok lekérése apiból
   */
  getData() {

    this.userSub?.unsubscribe();
    this.imagesSub?.unsubscribe();

    this.loading = true;

    this.userSub = this.flickrService.getNsidByUsername(this.text).pipe(first()).subscribe(
      nsid => this.foundUserId = nsid
    )

    this.imagesSub = this.flickrService.getPhotosSearch({text: this.text}).subscribe(
      res => {this.images = res;
      this.loading = false;}
    );

    this.words = this.text.split(" ");
  }

}
