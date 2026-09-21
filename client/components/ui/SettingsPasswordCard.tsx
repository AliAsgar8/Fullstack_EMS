"use client";

import { Lock } from "lucide-react";

type Props = {
  onChangePassword?: () => void;
};

export default function SettingsPasswordCard({ onChangePassword }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-slate-600">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">Password</p>
          <p className="text-sm text-slate-500">Update your account password</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onChangePassword}
        className="btn-secondary cursor-pointer"
      >
        Change
      </button>
    </div>
  );
}
