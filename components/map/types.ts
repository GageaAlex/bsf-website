export type MapPin = {
  id: string;
  kind: "event" | "place";
  name: string;
  description: string;
  category: string;
  photo: string | null;
  rating: number | null;
  date: string | null;
  lat: number;
  lng: number;
  href: string | null;
};
