export interface ILocation {
  latitude: number;
  longitude: number;
  detail?: string;
}

export interface ILocationBridge {
  locationId: number;
  postId: number;
}