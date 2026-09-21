"use client";

import { useState } from "react";
import SettingsPasswordCard from "@/components/ui/SettingsPasswordCard";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">
          Manage your account and preferences.
        </p>
      </div>

      <div className="mt-6 max-w-3xl">
        <SettingsPasswordCard onChangePassword={() => setIsOpen(true)} />
      </div>

      {isOpen && <ChangePasswordModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}
