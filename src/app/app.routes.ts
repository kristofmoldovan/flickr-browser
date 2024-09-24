import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RecentComponent } from './recent/recent.component';
import { TagComponent } from './tag/tag.component';
import { TrendingTagsComponent } from './trending-tags/trending-tags.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SearchComponent } from './search/search.component';
import { ReloadingComponent } from './reloading/reloading.component';

export const routes: Routes = [
    {
        path: '',
        component: RecentComponent,
        title: 'FlickrBrowser'
    },
    {
        path: 'user/:user',
        component: UserComponent,
        title: 'FlickrBrowser - Felhasználó'
    },
    {
        path: 'tag/:tag',
        component: TagComponent,
        title: 'FlickrBrowser - Tag'
    },
    {
        path: 'trending',
        component: TrendingTagsComponent,
        title: 'FlickrBrowser - Népszerű tagek'
    },
    {
        path: 'favorites',
        component: FavoritesComponent,
        title: 'FlickrBrowser - Kedvencek',
    },
    {
        path: 'search/:text',
        component: SearchComponent,
        title: 'FlickrBrowser - Keresés',
    },
    {
        path: 'reloading',
        component: ReloadingComponent,
        title: 'Reloading',
    }
];
