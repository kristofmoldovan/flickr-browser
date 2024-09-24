import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ImageGridComponent } from './image-grid/image-grid.component';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu'; 
import { FormsModule } from '@angular/forms';
import { FlickrService } from './flickr.service';
import { SettingsService } from './settings.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageGridComponent, RouterModule, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, FormsModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'flickr-browser';

  router = inject(Router);

  searchText: string = "";
  flickrService: FlickrService = inject(FlickrService);

  settingsService: SettingsService = inject(SettingsService);

  tempKey: string = "";
  settingsShown = false;

  snackBar = inject(MatSnackBar);


  showSettings() {
    this.settingsShown = true;
  }

  quit() {
    this.settingsShown = false;
  }

  setApiKey(key: string) {
    
    //Mentés
    this.settingsService.setApiKey(key);
    this.quit();
    
    //Értesítés
    let snackBarRef = this.snackBar.open("API kulcs sikeresen beállítva. Újratöltés...", 'OK');
        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });

    //Újratöltés
    this.redirectTo(this.router.url);

    
  }

  //ÁTIRÁNYÍTÁS
  redirectTo(url: string) {
    this.router.navigateByUrl('/reloading', { skipLocationChange: true }).then(() => {
    this.router.navigateByUrl(url)});
  }

  //KERESÉS
  doSearch() {
    this.router.navigateByUrl('/search/' + this.searchText);
  }

  //Feliratkozunk az esetleges hibaüzenetekre.
  constructor() {
    this.flickrService.getErrorObservable().subscribe(
      errorMsg => {
        let snackBarRef = this.snackBar.open(errorMsg, 'OK');
        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });
      } 
    );
  }

  ngOnInit() {
    this.tempKey = this.settingsService.getApiKey();
  }
}
