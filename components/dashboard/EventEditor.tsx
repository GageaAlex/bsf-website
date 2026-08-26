"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { MemberEvent } from "@/types/member-event";

const MapPinPicker = dynamic(() => import("@/components/events/MapPinPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md h-72 border border-white/10 flex items-center justify-center">
      <p className="text-muted text-sm font-sans">Loading map…</p>
    </div>
  ),
});

async function uploadEventImage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  file: File
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("event-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("event-images").getPublicUrl(path);
  return data.publicUrl;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>
  );
}

export default function EventEditor({
  mode,
  userId,
  authorName,
  event,
}: {
  mode: "new" | "edit";
  userId: string;
  authorName: string;
  event?: MemberEvent;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(event?.title || "");
  const [coverImage, setCoverImage] = useState<string | null>(event?.cover_image || null);
  const [description, setDescription] = useState(event?.description || "");
  const [price, setPrice] = useState(event?.price || "");
  const [dressCode, setDressCode] = useState(event?.dress_code || "");
  const [howToRegister, setHowToRegister] = useState(event?.how_to_register || "");
  const [eventDate, setEventDate] = useState(event?.event_date || new Date().toISOString().slice(0, 10));
  const [eventTime, setEventTime] = useState(event?.event_time || "");
  const [location, setLocation] = useState(event?.location || "");
  const [mapLat, setMapLat] = useState<number | null>(event?.map_lat ?? null);
  const [mapLng, setMapLng] = useState<number | null>(event?.map_lng ?? null);

  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setError(null);
    try {
      const supabase = createClient();
      const url = await uploadEventImage(supabase, userId, file);
      setCoverImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const save = async (status: "draft" | "published") => {
    if (!title.trim()) {
      setError("Please add a title before saving.");
      return;
    }
    if (!eventDate) {
      setError("Please choose an event date.");
      return;
    }

    setSaving(status === "draft" ? "draft" : "publish");
    setError(null);

    const supabase = createClient();
    const publishedAtIso = new Date(`${eventDate}T12:00:00Z`).toISOString();

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: price.trim() || null,
      dress_code: dressCode.trim() || null,
      how_to_register: howToRegister.trim() || null,
      event_date: eventDate,
      event_time: eventTime.trim() || null,
      location: location.trim() || null,
      cover_image: coverImage,
      map_lat: mapLat,
      map_lng: mapLng,
      status,
    };

    try {
      if (mode === "new") {
        const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 6)}`;
        const { data, error: insertError } = await supabase
          .from("events")
          .insert({
            author_id: userId,
            author_name: authorName,
            slug,
            published_at: status === "published" ? publishedAtIso : null,
            ...payload,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        router.push(status === "published" ? `/events/${data.slug}` : "/dashboard");
        router.refresh();
      } else if (event) {
        const { error: updateError } = await supabase
          .from("events")
          .update({
            ...payload,
            ...(status === "published" ? { published_at: publishedAtIso } : {}),
          })
          .eq("id", event.id);

        if (updateError) throw updateError;

        router.push(status === "published" ? `/events/${event.slug}` : "/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while saving.");
      setSaving(null);
    }
  };

  const isPublished = event?.status === "published";

  return (
    <div className="min-h-screen bg-obsidian px-6 py-14">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <Link
            href="/dashboard"
            className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => save("draft")}
              disabled={saving !== null}
              className="border border-white/15 hover:border-white/40 text-muted hover:text-ivory px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300 disabled:opacity-50"
            >
              {saving === "draft" ? "Saving…" : "Save Draft"}
            </button>
            <button
              onClick={() => save("published")}
              disabled={saving !== null}
              className="bg-ember hover:bg-ember-light text-ivory px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300 disabled:opacity-50"
            >
              {saving === "publish" ? "Publishing…" : isPublished ? "Save Changes" : "Publish"}
            </button>
          </div>
        </div>

        <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-2">
          BS4F Events
        </p>
        <h1 className="font-display text-3xl text-ivory mb-8">
          {mode === "new" ? "Publish New Event" : "Edit Event"}
        </h1>

        {error && (
          <div className="mb-6 border border-ember/40 bg-ember/10 text-ember text-sm font-sans px-4 py-3">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Cover image */}
          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Picture
            </label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
                e.target.value = "";
              }}
            />
            {coverImage ? (
              <div className="relative aspect-video overflow-hidden bg-charcoal group">
                <Image src={coverImage} alt="Event cover" fill className="object-cover" sizes="640px" />
                <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/50 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    className="text-2xs text-ivory tracking-editorial uppercase font-sans border border-ivory/40 px-4 py-2"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => setCoverImage(null)}
                    className="text-2xs text-ivory tracking-editorial uppercase font-sans border border-ivory/40 px-4 py-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="w-full aspect-video border border-dashed border-white/15 hover:border-white/30 text-muted hover:text-ivory text-2xs tracking-editorial uppercase font-sans transition-colors flex items-center justify-center"
              >
                {uploadingCover ? "Uploading…" : "Add Picture"}
              </button>
            )}
          </div>

          <Field label="Title" value={title} onChange={setTitle} placeholder="Event title" required />

          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="A few lines about the event..."
              className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Date" type="date" value={eventDate} onChange={setEventDate} required />
            <Field label="Time" value={eventTime} onChange={setEventTime} placeholder="e.g. 20:00 or All day" />
            <Field label="Location" value={location} onChange={setLocation} placeholder="Venue, area" />
            <Field label="Price" value={price} onChange={setPrice} placeholder="Free / €15 / ..." />
          </div>

          <Field label="Dress Code" value={dressCode} onChange={setDressCode} placeholder="e.g. Smart casual" />
          <Field
            label="How to Register"
            value={howToRegister}
            onChange={setHowToRegister}
            placeholder="Sign-up link or instructions"
          />

          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Map Location
            </label>
            <MapPinPicker lat={mapLat} lng={mapLng} onChange={(lat, lng) => { setMapLat(lat); setMapLng(lng); }} />
          </div>
        </div>
      </div>
    </div>
  );
}
