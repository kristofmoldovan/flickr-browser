interface FlickrImageBase {
    id: bigint,
    secret: string,
    server: bigint,
    farm: bigint
}

interface FlickrImage extends FlickrImageBase{
    owner: string,
    title: string,
    ownerNick: string,
    description: string,
    uploaded: bigint,
    lastUpdate: bigint,
    taken: string,
    views: bigint,
    tags: string[],
    url_m: string
}

export {FlickrImage, FlickrImageBase}
