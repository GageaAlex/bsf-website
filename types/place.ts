export type PlaceStatus = "draft" | "published";

export type PlaceCategory = "venue" | "business" | "place" | "article-location";

export const PLACE_CATEGORIES: { id: PlaceCategory; label: string }[] = [
  { id: "venue", label: "Venue" },
  { id: "business", label: "Business" },
  { id: "place", label: "Place" },
  { id: "article-location", label: "Mentioned in an Article" },
];

export type Place = {
  id: string;
  author_id: string;
  author_name: string;
  name: string;
  category: PlaceCategory;
  description: string;
  address: string | null;
  map_lat: number;
  map_lng: number;
  photo: string | null;
  // Never defaulted/fabricated — null unless a genuine rating exists.
  rating: number | null;
  info_url: string | null;
  related_article_id: string | null;
  related_event_id: string | null;
  status: PlaceStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};
