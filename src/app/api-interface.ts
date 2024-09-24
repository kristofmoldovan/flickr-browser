//Az API különböző válaszainak a struktúráját definiálom

interface ApiImage {
    id: bigint,
    owner: {nsid: string, username: string},
    server: bigint,
    secret: string,
    farm: bigint,
    title?: {_content: string | null} | null,
    description: {_content: string | null},
    dates: {
        lastupdate: bigint,
        posted: bigint,
        datetaken?: string | null,
    }
    ownerNick: string,
    tags?: ApiTagsArray,//{tag: string[]} | null,
    views: bigint
    url_m?: string
  }

interface ApiImageById {
  photo: ApiImage,
  stat: string
}


interface ApiImageV2 {
      id: bigint,
      owner: string,
      server: bigint,
      secret: string,
      farm: bigint,
      title: string,
      description: {_content : string} | null,
      lastupdate: bigint,
      dateupload: bigint,
      datetaken: string,
      taken: string,
      ownername: string,
      tags: string,
      views: bigint,
      url_m: string
    }

interface ApiImagesV2 {
    photos: {photo: ApiImageV2[]}
}

interface ApiImageV3 extends Omit<ApiImageV2, 'tags'> {
  tags: {}
}

interface ApiUser {
  user?: {
    id: string,
    nsid: string,
    username: {_content: string}
  },
  stat: string
}

interface ApiTag {
  machine_tag?: number | boolean
  _content: string
}

interface ApiTags {
  tags: ApiTagsArray
}

interface ApiTagsArray {
  tag: ApiTag[]
}


interface ApiPerson {
  id: string,
  nsid: string,
  ispro: number,
  is_deleted: number,
  iconserver: number,
  iconfarm: number,
  path_alias: string,
  has_stats: number,
  pro_badge: string,
  expire: number,
  username: {
      _content: string
  },
  description?: {
      _content: string
  },
  photosurl?: {
      _content: string
  },
  profileurl?: {
      _content: string
  },
  mobileurl?: {
      _content: string
  },
  photos?: {
      firstdatetaken: {
          _content: string
      },
      firstdate: {
          _content: bigint
      },
      count: {
          _content: number
      }
  },
  location?: {
    _content: string
  },
  realname?: {
    _content: string
  }
}

interface ApiPersonContainer {
  person: ApiPerson,
  stat: string
}

interface ApiExtendedTag extends ApiTag {
  thm_data: {photos: { photo: ApiImageV2[] }}
}

interface ApiHotTags {
  hottags: {
    tag: ApiExtendedTag[]
  }
}
export {ApiImage, ApiImageV2, ApiImagesV2, ApiUser, ApiTags, ApiTag, ApiImageById, ApiPerson, ApiHotTags, ApiExtendedTag, ApiPersonContainer}