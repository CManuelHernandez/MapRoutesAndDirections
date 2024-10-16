import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation?: [number, number];

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationRedy(): boolean {
    return !!this.userLocation;
  }

  constructor(private http: HttpClient) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (error) => {
          alert('No se pudo obtener la geolocalizacion');
          console.log(error);
          reject();
        }
      );
    });
  }

  getPlacesByQuery(query: string = '') {
    this.http
      .get<PlacesResponse>(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&proximity=-3.5331118096246428%2C40.379299755498636&language=es&access_token=pk.eyJ1IjoiY21hbmgiLCJhIjoiY20yMXg2Nnk3MDE1bDJrcXZzcGxjbG92ZyJ9.Trtaa39Q6v9TmL_wDcD9tw`
      )
      .subscribe((resp) => {
        this.isLoadingPlaces = false;
        this.places = resp.features;
      });
  }
}
