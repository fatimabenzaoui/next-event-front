import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface ZoomToEventProps {
  event: {
    address: {
      latitude: number;
      longitude: number;
    };
  };
}

const ZoomToEvent = ({ event }: ZoomToEventProps) => {
  const map = useMap();

  useEffect(() => {
    if (!event?.address?.latitude || !event?.address?.longitude) {
    console.error("Coordonnées manquantes pour le zoom :", event);
    return;
  }

    map.setView(
      [event.address.latitude, event.address.longitude],
      15,
      { animate: true }
    );
  }, [event, map]);

  return null;
};

export default ZoomToEvent;