"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Hardcoded password — replace with environment variable in production
const ADMIN_PASSWORD = "bs4f2024";

type Tab = "articles" | "events" | "members" | "alumni" | "settings";

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <p className="font-display text-3xl text-ivory mb-2">Admin</p>
        <p className="text-2xs text-muted tracking-editorial uppercase font-sans mb-10">BS4F CMS</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-2">
              Password
            </label>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={`w-full bg-charcoal border ${error ? "border-ember" : "border-white/15"} text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/40 transition-colors`}
              placeholder="Enter password"
              autoFocus
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-ember text-xs font-sans mt-2"
                >
                  Incorrect password
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <button
            type="submit"
            className="w-full bg-ember hover:bg-ember-light text-ivory py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300"
          >
            Enter
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");
  const [saved, setSaved] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "articles", label: "Articles" },
    { id: "events", label: "Events" },
    { id: "members", label: "Members" },
    { id: "alumni", label: "Alumni" },
    { id: "settings", label: "Settings" },
  ];

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/8 bg-charcoal flex flex-col shrink-0">
        <div className="p-6 border-b border-white/8">
          <p className="font-display text-xl text-ivory">BS4F</p>
          <p className="text-2xs text-muted font-sans tracking-editorial uppercase mt-0.5">CMS Admin</p>
        </div>
        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-6 py-3 text-xs tracking-editorial uppercase font-sans transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-ivory bg-white/5 border-r-2 border-ember"
                  : "text-muted hover:text-ivory"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/8">
          <a href="/home" className="text-2xs text-muted hover:text-ivory tracking-editorial uppercase font-sans transition-colors">
            ← Back to Site
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 bg-obsidian/95 backdrop-blur border-b border-white/8 px-8 py-4 flex items-center justify-between z-10">
          <h1 className="font-serif text-lg text-ivory capitalize">{activeTab}</h1>
          <AnimatePresence>
            {saved && (
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-ember font-sans tracking-editorial uppercase"
              >
                Saved ✓
              </motion.p>
            )}
          </AnimatePresence>
        </header>

        <div className="p-8">
          {activeTab === "articles" && <ArticlesTab onSave={showSaved} />}
          {activeTab === "events" && <EventsTab onSave={showSaved} />}
          {activeTab === "members" && <MembersTab onSave={showSaved} />}
          {activeTab === "alumni" && <AlumniTab onSave={showSaved} />}
          {activeTab === "settings" && <SettingsTab onSave={showSaved} />}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange, placeholder }: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-2xl text-ivory mb-6">{title}</h2>
      <div className="bg-charcoal border border-white/8 p-6 space-y-4">{children}</div>
    </div>
  );
}

function ArticlesTab({ onSave }: { onSave: () => void }) {
  const [title, setTitle] = useState("");
  const [rubric, setRubric] = useState("culture");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [publishDate, setPublishDate] = useState("");

  return (
    <div>
      <Section title="New Article">
        <FormField label="Title" value={title} onChange={setTitle} placeholder="Article title" />
        <div>
          <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-1.5">Rubric</label>
          <select
            value={rubric}
            onChange={(e) => setRubric(e.target.value)}
            className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="culture">Culture</option>
            <option value="business">Business</option>
            <option value="industry-interviews">Industry Interviews</option>
            <option value="bocco-brands">Bocco Brands</option>
            <option value="opinions">Opinions</option>
          </select>
        </div>
        <FormField label="Author Name" value={author} onChange={setAuthor} placeholder="Author name" />
        <FormField label="Excerpt" type="textarea" value={excerpt} onChange={setExcerpt} placeholder="Short excerpt..." />
        <FormField label="Cover Image URL" value={coverUrl} onChange={setCoverUrl} placeholder="https://..." />
        <FormField label="Publish Date" type="date" value={publishDate} onChange={setPublishDate} />
        <div className="pt-2">
          <button onClick={onSave} className="bg-ember hover:bg-ember-light text-ivory px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-300">
            Save Article
          </button>
        </div>
      </Section>

      <div className="bg-charcoal/50 border border-white/5 p-6">
        <p className="text-sm text-muted font-sans">
          Articles are stored in <code className="text-ivory/70 text-xs">/data/articles.json</code>. To publish, add your article object to the array and set <code className="text-ivory/70 text-xs">&quot;published&quot;: true</code>.
        </p>
      </div>
    </div>
  );
}

function EventsTab({ onSave }: { onSave: () => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [signupLink, setSignupLink] = useState("");

  return (
    <div>
      <Section title="New Upcoming Event">
        <FormField label="Title" value={title} onChange={setTitle} placeholder="Event title" />
        <FormField label="Date" type="date" value={date} onChange={setDate} />
        <FormField label="Location" value={location} onChange={setLocation} placeholder="Venue, City" />
        <FormField label="Description" type="textarea" value={description} onChange={setDescription} placeholder="Event description..." />
        <FormField label="Poster URL" value={posterUrl} onChange={setPosterUrl} placeholder="https://..." />
        <FormField label="Sign-up Link" value={signupLink} onChange={setSignupLink} placeholder="https://forms..." />
        <div className="pt-2">
          <button onClick={onSave} className="bg-ember hover:bg-ember-light text-ivory px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors">
            Save Event
          </button>
        </div>
      </Section>
    </div>
  );
}

function MembersTab({ onSave }: { onSave: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("board");
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");

  return (
    <div>
      <Section title="Add Member">
        <FormField label="Name" value={name} onChange={setName} placeholder="Full name" />
        <FormField label="Role" value={role} onChange={setRole} placeholder="e.g. Culture Writer" />
        <div>
          <label className="text-2xs text-muted tracking-editorial uppercase font-sans block mb-1.5">Team</label>
          <select value={team} onChange={(e) => setTeam(e.target.value)}
            className="w-full bg-charcoal border border-white/10 text-ivory px-4 py-3 font-sans text-sm focus:outline-none focus:border-white/30">
            <option value="board">Board</option>
            <option value="Editorials">Editorials</option>
            <option value="Events">Events</option>
            <option value="Marketing">Marketing</option>
            <option value="Partnerships">Partnerships</option>
          </select>
        </div>
        <FormField label="Photo URL" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." />
        <FormField label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
        <div className="pt-2">
          <button onClick={onSave} className="bg-ember hover:bg-ember-light text-ivory px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors">
            Add Member
          </button>
        </div>
      </Section>
    </div>
  );
}

function AlumniTab({ onSave }: { onSave: () => void }) {
  const [name, setName] = useState("");
  const [classYear, setClassYear] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [program, setProgram] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");

  return (
    <div>
      <Section title="Add Alumni">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" value={name} onChange={setName} placeholder="Full name" />
          <FormField label="Graduating Class" value={classYear} onChange={setClassYear} placeholder="2024" />
          <FormField label="Company" value={company} onChange={setCompany} placeholder="Company name" />
          <FormField label="Position" value={position} onChange={setPosition} placeholder="Job title" />
          <FormField label="Bocconi Program" value={program} onChange={setProgram} placeholder="BSc / MSc..." />
          <FormField label="Location" value={location} onChange={setLocation} placeholder="City, Country" />
        </div>
        <FormField label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
        <div className="pt-2">
          <button onClick={onSave} className="bg-ember hover:bg-ember-light text-ivory px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors">
            Add Alumni
          </button>
        </div>
      </Section>
    </div>
  );
}

function SettingsTab({ onSave }: { onSave: () => void }) {
  const [applyLink, setApplyLink] = useState("https://forms.example.com/apply");

  return (
    <div>
      <Section title="Application Form">
        <FormField label="Application Form Link" value={applyLink} onChange={setApplyLink} placeholder="https://forms.google.com/..." />
        <div className="pt-2">
          <button onClick={onSave} className="bg-ember hover:bg-ember-light text-ivory px-6 py-3 text-xs tracking-[0.2em] uppercase font-sans transition-colors">
            Save Settings
          </button>
        </div>
      </Section>

      <div className="bg-charcoal/50 border border-white/5 p-6">
        <p className="text-sm text-muted font-sans leading-relaxed">
          <strong className="text-ivory/80">Note:</strong> This admin panel is a mock CMS interface.
          To actually persist changes, connect these forms to a backend API or replace the JSON files in <code className="text-ivory/70 text-xs">/data/</code>.
          For a production CMS, consider Sanity or Contentful — the data structure is already compatible.
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  return authenticated ? (
    <AdminDashboard />
  ) : (
    <PasswordGate onSuccess={() => setAuthenticated(true)} />
  );
}
