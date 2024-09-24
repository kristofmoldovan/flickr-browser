import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlickrService } from '../flickr.service';
import { ImageGridComponent } from '../image-grid/image-grid.component';
import { FlickrImage } from '../flickr-image';
import { Subscription, first } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ApiPerson, ApiPersonContainer } from '../api-interface';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ImageGridComponent, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  flickrService: FlickrService = inject(FlickrService);

  idToFind: string;

  userData: ApiPerson | null = null;
  images: FlickrImage[] = [];
  favImages: FlickrImage[] = [];
  mentionedImages: FlickrImage[] = [];

  imageUrl: string = "https://www.flickr.com/images/buddyicon.gif";


  constructor() {
    this.idToFind = this.route.snapshot.params['user'] ?? "";
  }

  photosSub: Subscription | null = null;
  favSub: Subscription | null = null;
  userSub: Subscription | null = null;
  mentionedSub: Subscription | null = null;


  //Adatok lekérése API-ból
  ngOnInit(){

    this.route.params.subscribe(params => {
      this.idToFind = params['user'];

      this.userSub?.unsubscribe();
      this.photosSub?.unsubscribe();
      this.favSub?.unsubscribe();

      this.flickrService.getUserInfo(this.idToFind).subscribe((info: ApiPersonContainer) => {
        this.userData = info.person;
        this.imageUrl = (this.userData.iconserver > 0 ?
                        `http://farm${this.userData.iconfarm}.staticflickr.com/${this.userData.iconserver}/buddyicons/${this.idToFind}_r.jpg`
                        : "https://www.flickr.com/images/buddyicon.gif" );

      });



      this.photosSub = this.flickrService.getPublicPhotosOfUser(this.idToFind).subscribe(images => {
        this.images = images
      });

      this.favSub = this.flickrService.getFavPublicPhotosOfUser(this.idToFind).subscribe(images => {
        this.favImages = images
      });

      this.mentionedSub = this.flickrService.getPhotosWhereMentioned(this.idToFind).subscribe(images => {
        this.mentionedImages = images
      });

    });
    
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
    this.photosSub?.unsubscribe();
    this.favSub?.unsubscribe();
    this.mentionedSub?.unsubscribe();
  }
}
