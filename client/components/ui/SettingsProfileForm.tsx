"use client";

import { useState } from "react";
import { Save, UserRound } from "lucide-react";




export default function SettingsProfileForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <UserRound className="h-5 w-5 text-slate-600" />
        <h2 className="text-lg font-semibold text-slate-900">Public Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="full-name" className="label-field">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="label-field">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="position" className="label-field">
            Position
          </label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="bio" className="label-field">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a brief bio..."
            className="input-field resize-none"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            A short introduction that appears on your profile.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-sidebar-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-sidebar-accent/90"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
