export type EventStatus = "draft" | "published";

// 'bs4f' = organized by BS4F (the Upcoming/Past sections). 'milan' = "What's
// Happening in Milan?" — external events/places BS4F is surfacing.
export type EventCategory = "bs4f" | "milan";

export const EVENT_CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: "bs4f", label: "BS4F Events" },
  { id: "milan", label: "What's Happening in Milan?" },
];

export type MemberEvent = {
  id: string;
  author_id: string;
  author_name: string;
  title: string;
  slug: string;
  category: EventCategory;
  event_type: string | null;
  organizer: string | null;
  cover_image: string | null;
  video_url: string | null;
  description: string;
  full_description: string | null;
  price: string | null;
  dress_code: string | null;
  how_to_register: string | null;
  external_url: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  address: string | null;
  map_lat: number | null;
  map_lng: number | null;
  related_article_id: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};
