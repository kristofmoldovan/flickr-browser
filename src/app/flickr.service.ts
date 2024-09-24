import { Injectable, inject } from '@angular/core';
import { SettingsService } from './settings.service';
import { Observable, Subject, asapScheduler, asyncScheduler, catchError, first, map, of, scheduled } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlickrImage } from './flickr-image';
import { ApiImage, ApiImageV2, ApiImagesV2, ApiUser, ApiTags, ApiTag, ApiImageById, ApiPersonContainer, ApiHotTags, ApiExtendedTag } from './api-interface';

/**
 * Ezen Service kezeli az API hívásokat és az esetleges hibákról való Observable értesítést.
 *
 * @export
 * @class FlickrService
 */
@Injectable({
  providedIn: 'root'
})


export class FlickrService {
  settingsService: SettingsService = inject(SettingsService);
  httpClient: HttpClient = inject(HttpClient);
  readonly baseUrl = "/services/rest"

  private subject = new Subject<string>();


  /**
   * 
   * @returns Hibaüzenet Observable, amire fel lehet iratkozni
   */
  getErrorObservable() {
    return this.subject.asObservable();
  }

  /**
   * 
   * @param msg Hibaüzenet küldése a feliratkozók számára
   */
  private sendErrorMsg(msg: string) {
    this.subject.next(msg);
  }

  /**
   * Egy kép URL-jét adja vissza
   * @param server 
   * @param id 
   * @param secret 
   * @returns 
   */
  getSrcOfImage(server: bigint, id: bigint, secret: string) {
    return `https://live.staticflickr.com/${server}/${id}_${secret}.jpg`;
  }


  /**
   * Egy kép adatait kéri le id és secret alapján
   * @param id 
   * @param secret 
   * @returns 
   */
  getInfoOfImage(id: bigint, secret: string): Observable<FlickrImage> {
    return this.callApi<ApiImageById>("flickr.photos.getInfo",
      { 
        photo_id: id,
        secret: secret,
        extras: "description,date_upload,date_taken,owner_name,last_update,tags,machine_tags,o_dims,views,media,url_m"
      }
    ).pipe(
      map((res: ApiImageById) =>
        this.mapSingleToFlickrImage(res.photo)
      )
    );
  }


  /**
   * Egy taghez a kapcsolódó tageket adja vissza
   * @param tag 
   * @returns 
   */
  getRelatedTags(tag: string): Observable<string[]> {
    return this.callApi<ApiTags>("flickr.tags.getRelated", {tag: tag}).pipe(
      map((res:ApiTags) => {return res.tags.tag.map( (item: ApiTag) => item._content)} )
    )
  }


/**
 * Trending tagek
 * @returns TrendingTag Observable
 */
  getTrendingTags() {
    return this.callApi<ApiHotTags>("flickr.tags.getHotList", {count: 20}).pipe(
      map(
        (res: ApiHotTags) => res.hottags.tag.map(
          (item: ApiExtendedTag) => { 
            return {
              text: item._content,
              photoId: item.thm_data.photos.photo[0].id,
              secret: item.thm_data.photos.photo[0].secret,
              server: item.thm_data.photos.photo[0].server
            }
        }
    )));
  }

  /**
   * Felhasználó publikus fotói
   * @param nsid 
   * @returns 
   */

  getPublicPhotosOfUser(nsid: string) {
    return this.callApi<ApiImagesV2>("flickr.people.getPublicPhotos", {user_id: nsid, extras: "description,date_upload,date_taken,owner_name,last_update,tags,machine_tags,o_dims,views,media,url_m"})
    .pipe(map(
      (res:ApiImagesV2) => {
        return this.mapToFlickrImage(res.photos.photo);
      }
    ));
  }


/**
 * Felhasználó kedvenc (publikus) képeinek lekérése
 *
 * @param {string} nsid
 * @return {*} 
 * @memberof FlickrService
 */
getFavPublicPhotosOfUser(nsid: string) {
    return this.callApi<ApiImagesV2>("flickr.favorites.getPublicList", {user_id: nsid, extras: "description,date_upload,date_taken,owner_name,last_update,tags,machine_tags,o_dims,views,media,url_m"})
    .pipe(map(
      (res:ApiImagesV2) => {
        return this.mapToFlickrImage(res.photos.photo);
      }
    ));
  }


/**
 * Azon képek lekérése, ahol a felhasználó meg van jelölve.
 *
 * @param {string} nsid
 * @return {*} 
 * @memberof FlickrService
 */
getPhotosWhereMentioned(nsid: string) {
    return this.callApi<ApiImagesV2>("flickr.people.getPhotosOf", {user_id: nsid, extras: "description,date_upload,date_taken,owner_name,last_update,tags,machine_tags,o_dims,views,media,url_m"})
    .pipe(map(
      (res: ApiImagesV2) => {
        return this.mapToFlickrImage(res.photos.photo);
      }
    ));
  }


/**
 *Felhasználó adatainak lekérése ID alapján
 *
 * @param {string} nsid
 * @return {*} 
 * @memberof FlickrService
 */
getUserInfo(nsid: string) {
    return this.callApi<ApiPersonContainer>("flickr.people.getInfo", {user_id: nsid});
  }



  /**
   *Legutóbbi legérdekesebb képek lekérése
   *
   * @return {*}  {Observable<FlickrImage[]>}
   * @memberof FlickrService
   */
  getRecent():  Observable<FlickrImage[]> {
    return this.callApi<ApiImagesV2>("flickr.interestingness.getList", {extras: "description,date_upload,date_taken,owner_name,last_update,tags,machine_tags,o_dims,views,media,url_m"})
    .pipe(
      map((res: ApiImagesV2) => {
            return this.mapToFlickrImage(res.photos.photo);
      })
    );
  }


/**
 * Keresés API-n keresztül
 *
 * @param {{user_id?: string, tags?: string, tag_mode?: string, text?: string}} [{user_id, tags, tag_mode, text}={}]
 * @return {*} 
 * @memberof FlickrService
 */
  getPhotosSearch({user_id, tags, tag_mode, text}: {user_id?: string, tags?: string, tag_mode?: string, text?: string} = {}) {
    let a = { 
        ...user_id && {user_id},
        ...tag_mode && {tag_mode},
        ...tags && {tags},
        ...text && {text},
        extras: "description,date_upload,date_taken,owner_name,last_update,tags,machine_tags,o_dims,views,media,url_m"
      };
    console.dir(a, {depth: null});
    return this.callApi<ApiImagesV2>("flickr.photos.search",
      a
    ).pipe(
      map((res: ApiImagesV2) =>
        this.mapToFlickrImage(res.photos.photo)
      )
    );
  }


/**
 *  Felhasználónév alapján lekéri az ID-jét
 *
 * @param {string} username
 * @return {*}  {(Observable<string | null>)}
 * @memberof FlickrService
 */
getNsidByUsername(username: string) : Observable<string | null> {
    return this.callApi<ApiUser>("flickr.people.findByUsername", {username: username}).pipe(
      map((res: ApiUser) => {console.log(res);return res.stat != "fail" ? (res.user?.nsid ?? null) : null})
    );
  }


/**
 *  Api válaszból készít FlickrImage tömböt
 *  
 * @param {Array<ApiImageV2>} [arr=[]]
 * @return {*} 
 * @memberof FlickrService
 */
mapToFlickrImage(arr: Array<ApiImageV2> = []) {
    return arr.map(
      (item: ApiImageV2) => {
        const a: FlickrImage = {
          id: item.id,
          owner: item.owner,
          server: item.server,
          secret: item.secret,
          farm: item.farm,
          title: item.title,
          description: item.description?._content ?? "",
          lastUpdate: item.lastupdate,
          uploaded: item.dateupload,
          taken: item.datetaken,
          ownerNick: item.ownername,
          tags: item?.tags.split(" "),
          views: item.views,
          url_m: item.url_m
        }
        return a;
      }
    );
  }

/**
 *  API válaszból készít egy FlickrImage objektumot
 *  
 * @param {*} item kép objektum
 * @return {*}  {FlickrImage}
 * @memberof FlickrService
 */
mapSingleToFlickrImage(item: ApiImage): FlickrImage {
    return {
          id: item.id,
          owner: item.owner.nsid,
          server: item.server,
          secret: item.secret,
          farm: item.farm,
          title: item.title?._content ?? "",
          description: item.description?._content ?? "",
          lastUpdate: item.dates.lastupdate,
          uploaded: item.dates.posted,
          taken: item.dates.datetaken ?? "",
          ownerNick: item.owner.username,
          tags: item.tags?.tag.filter((el: ApiTag) => {
            return (el.machine_tag == 0);
          }).map((el:ApiTag) => el._content) ?? [],
          views: item.views,
          url_m: this.getSrcOfImage(item.server, item.id, item.secret)
        }
  }


/**
 *
 * Általános api hívás. A kötelező paramétereket alapból rárakja, nem kell megadni.
 * Hiba esetén üzenetet küld!
 *  
 * @template T Visszatérési érték típusa
 * @param {string} method Kért api metódus neve
 * @param {*} [params={}] paraméterek
 * @return {*}  {Observable<T>}
 * @memberof FlickrService
 */
callApi<T>(method: string, params: any = {}): Observable<T> {

    let httpParams: HttpParams = new HttpParams();

    httpParams = httpParams.append('method', method).append('api_key', this.settingsService.getApiKey()).append('format', 'json').append('nojsoncallback', 1);

    for (let key in params) {
      httpParams = httpParams.append(key, params[key]);
    }
    console.log(httpParams.keys());
    

    return this.httpClient.get<T>(this.baseUrl,{params: httpParams}).pipe(
      catchError<any, any>((err: any) => {
        this.sendErrorMsg("Hálózati hiba. Kérlek ellenőrizd le a konzolt.");
        console.log(err);

        return scheduled([], asyncScheduler);
      })
      ,
      map((res: {stat: string, message?: string} & T) => {
        if (res.stat)
          if (res.stat == "fail")

            //Nem megtalált felhasználó nem számít hibának
            if(res.message != "User not found") {
              this.sendErrorMsg("API Hiba. Kérlek ellenőrizd le a konzolt.")
              console.log("API HIBA:\n" + JSON.stringify(res));
              throw new Error();
            }
        return res;
      })
      ,
      first());
  }

}
