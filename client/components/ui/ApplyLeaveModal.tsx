"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function ApplyLeaveModal({ onClose }: Props) {
  const [type, setType] = useState("SICK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-white shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Apply for Leave
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Submit a new leave request
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-surface hover:text-slate-700 cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="leave-type" className="label-field">
              Leave type
            </label>
            <select
              id="leave-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
              required
            >
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start-date" className="label-field">
                Start date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="end-date" className="label-field">
                End date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="label-field">
              Reason
            </label>
            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you need leave?"
              className="input-field resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-sidebar-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-sidebar-accent/90 cursor-pointer"
            >
              Submit request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
