"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const MILAN_CENTER: [number, number] = [45.4642, 9.19];

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#C0392B;border:2px solid #F5F0EB;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPinPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const position: [number, number] = lat !== null && lng !== null ? [lat, lng] : MILAN_CENTER;

  return (
    <div>
      <div className="w-full max-w-md h-72 border border-white/10 overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ width: "100%", height: "100%", background: "#111111" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ClickHandler onPick={onChange} />
          {lat !== null && lng !== null && (
            <Marker
              position={[lat, lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target as L.Marker;
                  const { lat: newLat, lng: newLng } = marker.getLatLng();
                  onChange(newLat, newLng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-2xs text-muted font-sans mt-2">
        Click the map to place a pin for this event&apos;s location — drag it to fine-tune, or click again to move it.
      </p>
    </div>
  );
}
