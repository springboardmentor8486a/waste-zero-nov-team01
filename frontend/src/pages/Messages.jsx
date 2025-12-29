// src/pages/Messages.jsx
import { useNavigate } from "react-router-dom";

const dummyThreads = [
  {
    id: "ngo1",
    name: "Helping Hands NGO",
    lastMessage: "Thank you for showing interest!",
    time: "10:24 AM",
    unread: 2,
  },
  {
    id: "ngo2",
    name: "Green Earth Volunteers",
    lastMessage: "We have a cleanup drive tomorrow.",
    time: "Yesterday",
    unread: 0,
  },
];

export default function Messages() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      <header className="px-6 py-4 border-b bg-white dark:bg-slate-950 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Messages</h1>
          <p className="text-xs text-gray-500">
            Chat with NGOs and volunteers.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {dummyThreads.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/chat/${t.id}`)}
            className="w-full text-left bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-semibold">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {t.lastMessage}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400">{t.time}</p>
              {t.unread > 0 && (
                <span className="inline-flex items-center justify-center mt-1 h-5 min-w-[20px] rounded-full bg-emerald-500 text-[10px] text-white px-1">
                  {t.unread}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}