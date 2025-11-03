/* ==================================================================================
   GOOGLE MAPS TypeScript Definitions
   ==================================================================================
   Complete type definitions for Google Maps JavaScript API
   ================================================================================== */

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number | undefined;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      zoomControl?: boolean;
      disableDefaultUI?: boolean;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      contains(latLng: LatLng | LatLngLiteral): boolean;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng | undefined;
      setPosition(latlng: LatLng | LatLngLiteral): void;
      addListener(eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      label?: string;
      draggable?: boolean;
      animation?: Animation;
    }

    interface Icon {
      url?: string;
      scaledSize?: Size;
      size?: Size;
      anchor?: Point;
    }

    interface Symbol {
      path: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
      anchor?: Point;
      labelOrigin?: Point;
    }

    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
      FORWARD_OPEN_ARROW = 2,
      BACKWARD_CLOSED_ARROW = 3,
      BACKWARD_OPEN_ARROW = 4,
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2,
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      setContent(content: string | Node): void;
      open(options?: InfoWindowOpenOptions): void;
      open(map?: Map, anchor?: Marker): void;
      close(): void;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
    }

    interface InfoWindowOpenOptions {
      map?: Map;
      anchor?: Marker;
      shouldFocus?: boolean;
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace event {
      function addListener(instance: any, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
      function removeListener(listener: MapsEventListener): void;
      function trigger(instance: any, eventName: string, ...args: any[]): void;
      function addListenerOnce(instance: any, eventName: string, handler: (...args: any[]) => void): MapsEventListener;
    }
  }
}

interface Window {
  google?: typeof google;
  initMap?: () => void;
}
