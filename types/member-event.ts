export type EventStatus = "draft" | "published";

export type MemberEvent = {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  slug: string;
  cover_image: string | null;
  description: string;
  price: string | null;
  dress_code: string | null;
  how_to_register: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  map_lat: number | null;
  map_lng: number | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};
