"use client";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
  initialRole: string;
};

const OPTIONS = ["ADMIN", "EDITOR", "SUBSCRIBER", "USER"] as const;

export default function RoleSelect({ id, initialRole }: Props) {
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    const prev = role;
    setRole(newRole);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/anvandare/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const text = await res.text();
        setRole(prev);
        toast.error("Kunde inte uppdatera roll: " + text);
      } else {
        toast.success(`Rollen uppdaterad till ${newRole}`);
      }
    } catch {
      setRole(prev);
      toast.error("Nätverksfel vid uppdatering av roll");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={loading}
      className="border rounded px-2 py-1 text-sm"
      aria-label="Ändra roll"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
