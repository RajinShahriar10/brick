"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Mail, MailOpen, Trash2, RefreshCw } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) setContacts(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id: string) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (selected?.id === id) setSelected(null);
    fetchContacts();
  };

  const unread = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:ml-60 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Inquiries</h1>
            {unread > 0 && (
              <p className="text-xs text-red-400 mt-1">{unread} unread</p>
            )}
          </div>
          <button
            onClick={fetchContacts}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-white/5 text-white/60 rounded-lg border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-white">Loading...</p>
        ) : contacts.length === 0 ? (
          <p className="text-xs text-white">No inquiries yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-white/5 bg-white/[0.02] overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="w-10 px-4 py-4" />
                    <th className="text-left px-4 py-4 text-[11px] uppercase tracking-widest text-white font-medium">
                      From
                    </th>
                    <th className="text-left px-4 py-4 text-[11px] uppercase tracking-widest text-white font-medium">
                      Subject
                    </th>
                    <th className="text-left px-4 py-4 text-[11px] uppercase tracking-widest text-white font-medium">
                      Date
                    </th>
                    <th className="w-24 px-4 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelected(c);
                        if (!c.isRead) markAsRead(c.id);
                      }}
                      className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                        !c.isRead ? "bg-red-600/5" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        {c.isRead ? (
                          <MailOpen className="h-3.5 w-3.5 text-white/30" />
                        ) : (
                          <Mail className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-white">{c.name}</p>
                        <p className="text-[11px] text-white/40">{c.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-white truncate max-w-[200px]">
                          {c.subject}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-white/60 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(c.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-600/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400/50 hover:text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 h-fit sticky top-24">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{selected.name}</h3>
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
                    >
                      {selected.email}
                    </a>
                  </div>
                  <span className="text-[10px] text-white/40 whitespace-nowrap">
                    {new Date(selected.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mb-4 pb-4 border-b border-white/5">
                  <p className="text-[11px] uppercase tracking-widest text-white/30 mb-1">Subject</p>
                  <p className="text-sm text-white">{selected.subject}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/30 mb-1">Message</p>
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
