"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import {
  RUBRICS,
  SERIES,
  TEMPLATES,
  type ArticleTemplate,
  type MemberArticle,
  type Rubric,
  type Series,
} from "@/types/member-article";

async function uploadArticleImage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  file: File
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("article-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("article-images").getPublicUrl(path);
  return data.publicUrl;
}

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`px-3 py-1.5 text-xs font-sans border transition-colors duration-200 ${
        active
          ? "border-ember text-ivory bg-ember/10"
          : "border-white/10 text-muted hover:text-ivory hover:border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onUploadImage,
  uploadingImage,
}: {
  editor: Editor | null;
  onUploadImage: () => void;
  uploadingImage: boolean;
}) {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-y border-white/8 sticky top-0 bg-obsidian/95 backdrop-blur z-10">
      <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        B
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </ToolbarButton>
      <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        &ldquo;&rdquo;
      </ToolbarButton>
      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
        Link
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={onUploadImage}>
        {uploadingImage ? "Uploading…" : "Image"}
      </ToolbarButton>
    </div>
  );
}

type RelatedOption = { id: string; label: string };

export default function ArticleEditor({
  mode,
  userId,
  authorName,
  article,
}: {
  mode: "new" | "edit";
  userId: string;
  authorName: string;
  article?: MemberArticle;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || "");
  const [subtitle, setSubtitle] = useState(article?.subtitle || "");
  const [rubric, setRubric] = useState<Rubric>(article?.rubric || RUBRICS[0].id);
  const [series, setSeries] = useState<Series | "">(article?.series || "");
  const [tagsInput, setTagsInput] = useState((article?.tags || []).join(", "));
  const [template, setTemplate] = useState<ArticleTemplate>(article?.template || "feature");
  const [credits, setCredits] = useState(article?.credits || "");
  const [seoTitle, setSeoTitle] = useState(article?.seo_title || "");
  const [metaDescription, setMetaDescription] = useState(article?.meta_description || "");
  const [relatedEventId, setRelatedEventId] = useState(article?.related_event_id || "");
  const [relatedLocationId, setRelatedLocationId] = useState(article?.related_location_id || "");
  const [eventOptions, setEventOptions] = useState<RelatedOption[]>([]);
  const [locationOptions, setLocationOptions] = useState<RelatedOption[]>([]);
  const [publishDate, setPublishDate] = useState(
    article?.published_at
      ? article.published_at.slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [coverImage, setCoverImage] = useState<string | null>(article?.cover_image || null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("events")
      .select("id, title")
      .eq("status", "published")
      .then(({ data }) => setEventOptions((data || []).map((e) => ({ id: e.id, label: e.title }))));
    supabase
      .from("places")
      .select("id, name")
      .eq("status", "published")
      .then(({ data }) => setLocationOptions((data || []).map((p) => ({ id: p.id, label: p.name }))));
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage.configure({ HTMLAttributes: { class: "rounded-sm" } }),
      Placeholder.configure({ placeholder: "Start writing your article…" }),
    ],
    content: article?.content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-lg max-w-none font-sans text-ivory/80 leading-relaxed focus:outline-none min-h-[50vh]",
      },
    },
  });

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setError(null);
    try {
      const supabase = createClient();
      const url = await uploadArticleImage(supabase, userId, file);
      setCoverImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleInlineImageUpload = async (file: File) => {
    if (!editor) return;
    setUploadingImage(true);
    setError(null);
    try {
      const supabase = createClient();
      const url = await uploadArticleImage(supabase, userId, file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const save = async (status: "draft" | "published") => {
    if (!editor) return;
    if (!title.trim()) {
      setError("Please add a title before saving.");
      return;
    }

    if (status === "published" && !publishDate) {
      setError("Please choose a publish date.");
      return;
    }

    setSaving(status === "draft" ? "draft" : "publish");
    setError(null);

    const supabase = createClient();
    const content = editor.getHTML();
    // Anchor at UTC noon (not midnight) so the chosen calendar date can't roll
    // to the previous/next day when read back in a different timezone. A
    // future date here means the article stays hidden from public reads
    // (repository.getPublishedArticles filters on published_at <= now()) —
    // this is how "schedule" works, no separate status needed.
    const publishedAtIso = new Date(`${publishDate}T12:00:00Z`).toISOString();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const sharedFields = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      rubric,
      series: series || null,
      tags,
      template,
      content,
      cover_image: coverImage,
      credits: credits.trim() || null,
      seo_title: seoTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
      related_event_id: relatedEventId || null,
      related_location_id: relatedLocationId || null,
      status,
    };

    try {
      if (mode === "new") {
        const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 6)}`;
        const { data, error: insertError } = await supabase
          .from("articles")
          .insert({
            author_id: userId,
            author_name: authorName,
            slug,
            published_at: status === "published" ? publishedAtIso : null,
            ...sharedFields,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        router.push(status === "published" ? `/editorials/${rubric}/${data.slug}` : "/dashboard");
        router.refresh();
      } else if (article) {
        const { error: updateError } = await supabase
          .from("articles")
          .update({
            ...sharedFields,
            ...(status === "published" ? { published_at: publishedAtIso } : {}),
          })
          .eq("id", article.id);

        if (updateError) throw updateError;

        router.push(status === "published" ? `/editorials/${rubric}/${article.slug}` : "/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while saving.");
      setSaving(null);
    }
  };

  const isPublished = article?.status === "published";

  return (
    <div className="min-h-screen bg-obsidian px-6 py-14">
      <div className="max-w-3xl mx-auto">
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

        {error && (
          <div className="mb-6 border border-ember/40 bg-ember/10 text-ember text-sm font-sans px-4 py-3">
            {error}
          </div>
        )}

        {/* Cover image */}
        <div className="mb-8">
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
            <div className="relative aspect-[21/9] overflow-hidden bg-charcoal group">
              <Image src={coverImage} alt="Cover" fill className="object-cover" sizes="768px" />
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
              className="w-full aspect-[21/9] border border-dashed border-white/15 hover:border-white/30 text-muted hover:text-ivory text-2xs tracking-editorial uppercase font-sans transition-colors flex items-center justify-center"
            >
              {uploadingCover ? "Uploading…" : "Add Cover Image (optional)"}
            </button>
          )}
        </div>

        {/* Series + Rubric + Publish Date */}
        <div className="mb-6 flex flex-wrap gap-6">
          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Series (primary — Editorials tab)
            </label>
            <select
              value={series}
              onChange={(e) => setSeries(e.target.value as Series | "")}
              className="bg-charcoal border border-white/10 text-ivory px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="">Uncategorized</option>
              {SERIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Rubric (secondary tag)
            </label>
            <select
              value={rubric}
              onChange={(e) => setRubric(e.target.value as Rubric)}
              className="bg-charcoal border border-white/10 text-ivory px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            >
              {RUBRICS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Publish Date
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="bg-charcoal border border-white/10 text-ivory px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
            <p className="text-2xs text-faint font-sans mt-1 max-w-[16rem]">
              A future date keeps this hidden from the public site until then.
            </p>
          </div>
        </div>

        {/* Template */}
        <div className="mb-6">
          <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
            Layout Template
          </label>
          <div className="flex flex-wrap gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                aria-pressed={template === t.id}
                title={t.description}
                className={`px-4 py-2.5 text-xs font-sans border transition-colors duration-200 text-left ${
                  template === t.id
                    ? "border-ember text-ivory bg-ember/10"
                    : "border-white/10 text-muted hover:text-ivory hover:border-white/30"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title + subtitle */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="w-full bg-transparent border-none text-ivory font-display text-4xl sm:text-5xl leading-tight placeholder:text-ivory/20 focus:outline-none mb-4"
        />
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtitle / dek (optional)"
          className="w-full bg-transparent border-none text-ivory/70 font-serif text-xl leading-snug placeholder:text-ivory/20 focus:outline-none mb-8"
        />

        {/* Toolbar + editor */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleInlineImageUpload(file);
            e.target.value = "";
          }}
        />
        <Toolbar
          editor={editor}
          uploadingImage={uploadingImage}
          onUploadImage={() => imageInputRef.current?.click()}
        />
        <div className="py-8">
          <EditorContent editor={editor} />
        </div>

        {/* Extra metadata */}
        <div className="mt-4 pt-8 border-t border-white/8 space-y-6">
          <h2 className="font-serif text-lg text-ivory">Additional Details</h2>

          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Tags (comma-separated, optional)
            </label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. sustainability, menswear, MFW26"
              className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Credits (optional)
            </label>
            <input
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="e.g. Photography by ..."
              className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Related Event (optional)
              </label>
              <select
                value={relatedEventId}
                onChange={(e) => setRelatedEventId(e.target.value)}
                className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
              >
                <option value="">None</option>
                {eventOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
                Related Map Location (optional)
              </label>
              <select
                value={relatedLocationId}
                onChange={(e) => setRelatedLocationId(e.target.value)}
                className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
              >
                <option value="">None</option>
                {locationOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              SEO Title (optional — defaults to the article title)
            </label>
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title || "Article title"}
              className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Meta Description (optional, for search/social previews)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="One or two sentences summarizing the article."
              className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
