/* ==================================================================================
   HERE MAPS API v3.1 TypeScript Definitions
   ==================================================================================
   Type-Definitionen für HERE Maps JavaScript API v3.1
   ================================================================================== */

declare namespace H {
  namespace service {
    class Platform {
      constructor(options: { apikey: string });
      createDefaultLayers(): DefaultLayers;
    }

    interface DefaultLayers {
      vector: {
        normal: {
          map: H.map.layer.Layer;
          traffic: H.map.layer.Layer;
          truck: H.map.layer.Layer;
        };
      };
      raster: {
        normal: {
          map: H.map.layer.Layer;
        };
      };
    }
  }

  namespace map {
    class Map {
      constructor(
        element: HTMLElement,
        baseLayer: layer.Layer,
        options?: {
          zoom?: number;
          center?: { lat: number; lng: number };
          pixelRatio?: number;
        }
      );

      setCenter(coords: { lat: number; lng: number }): void;
      setZoom(zoom: number): void;
      addObject(obj: Object): void;
      removeObject(obj: Object): void;
      dispose(): void;
      getViewPort(): ViewPort;
      getViewModel(): ViewModel;
    }

    class Marker extends Object {
      constructor(coords: { lat: number; lng: number }, options?: { icon?: Icon; data?: any });
      getGeometry(): { lat: number; lng: number };
      addEventListener(type: string, handler: (evt: any) => void): void;
    }

    class Icon {
      constructor(svg: string, options?: any);
    }

    class Group extends Object {
      addObject(obj: Object): void;
      getBoundingBox(): geo.Rect;
    }

    class Object {
      setVisibility(visible: boolean): void;
    }

    namespace layer {
      class Layer {}
    }

    interface ViewPort {
      resize(): void;
    }

    interface ViewModel {
      setLookAtData(data: {
        bounds?: geo.Rect;
        zoom?: number;
        position?: { lat: number; lng: number };
      }): void;
    }
  }

  namespace ui {
    class UI {
      static createDefault(map: map.Map, layers: service.DefaultLayers, locale?: string): UI;
      addBubble(bubble: InfoBubble): void;
    }

    class InfoBubble {
      constructor(coords: { lat: number; lng: number }, options: { content: string }): void;
    }
  }

  namespace mapevents {
    class MapEvents {
      constructor(map: map.Map): void;
    }

    class Behavior {
      constructor(events: MapEvents): void;
    }
  }

  namespace geo {
    class Rect {
      constructor(top: number, left: number, bottom: number, right: number): void;
    }
  }
}

interface Window {
  H: typeof H;
}
