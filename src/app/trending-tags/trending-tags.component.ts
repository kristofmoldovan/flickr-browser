import { Component, inject } from '@angular/core';
import { FlickrService } from '../flickr.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrendingTag } from '../trending-tag';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-trending-tags',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trending-tags.component.html',
  styleUrl: './trending-tags.component.css'
})
export class TrendingTagsComponent {
  flickrService: FlickrService = inject(FlickrService);

  trendingTagsToday: TrendingTag[][] = [];
  


  //tag képének az URL-jének a lekérése
  getSrcOfTag(tag: TrendingTag){
    return this.flickrService.getSrcOfImage(tag.server, tag.photoId, tag.secret);
  }

  ngOnInit() {
    this.flickrService.getTrendingTags().subscribe(tags => {
      let temp = tags;
      for (let i = 0; i < temp.length; i += 5)
        this.trendingTagsToday.push(temp.slice(i, i + 5));
    });
  }
}
