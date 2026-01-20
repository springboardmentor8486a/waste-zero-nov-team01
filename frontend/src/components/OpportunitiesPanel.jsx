import React from 'react';

export default function OpportunitiesPanel({ opportunities = [], wishlist = [], toggleWishlist, joinOpportunity, leaveOpportunity, loading = false, joined = [], layout = 'side-by-side' }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6 dark:border dark:border-slate-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Nearby Opportunities</h2>
        <div className="text-sm text-slate-500 dark:text-slate-400">Tap heart to wishlist</div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400">Loading opportunities…</div>
      ) : (
        layout === 'stack' ? (
          <div className="space-y-6">
            {/* Nearby as a stacked list */}
            <div className="space-y-4">
              {opportunities.map(op => (
                <div key={op.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow relative z-0 hover:z-10 overflow-hidden">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${op.color} flex items-center justify-center text-white font-bold shadow-md`}>OP</div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{op.title}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300">{op.org}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-500">{op.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => toggleWishlist(op)} aria-pressed={wishlist.includes(op.id)} className={`relative z-30 pointer-events-auto p-2 rounded-md transform transition-transform hover:scale-105 flex-shrink-0 ${wishlist.includes(op.id) ? 'bg-pink-50 text-pink-500' : 'bg-transparent text-slate-400 hover:bg-slate-100'}`}>
                      {wishlist.includes(op.id) ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9.2-6.67C.9 11.5 3.5 7 7.5 7c2 0 3 .9 4.5 2.4C13.5 7.9 14.5 7 16.5 7 20.5 7 23.1 11.5 21.2 14.33 19 16.65 12 21 12 21z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-9.2-6.67C.9 11.5 3.5 7 7.5 7c2 0 3 .9 4.5 2.4C13.5 7.9 14.5 7 16.5 7 20.5 7 23.1 11.5 21.2 14.33 19 16.65 12 21 12 21z" /></svg>
                      )}
                    </button>

                    {joined.includes(op.id) ? (
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={(e) => { e.stopPropagation(); leaveOpportunity(op); }} className="relative z-30 pointer-events-auto px-3 py-2 bg-rose-100 text-rose-600 rounded-md shadow-sm hover:bg-rose-200 transition flex-shrink-0 whitespace-nowrap">Leave</button>
                        <button disabled className="px-3 py-2 bg-slate-200 text-slate-600 rounded-md shadow-sm">Joined</button>
                      </div>
                    ) : (
                      <button type="button" onClick={(e) => { e.stopPropagation(); joinOpportunity(op); }} className="px-3 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-md shadow-sm hover:opacity-90 transition flex-shrink-0 whitespace-nowrap">Join</button>
                    )} 
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{/* previous side-by-side layout preserved */}
            {/* Nearby opportunities */}
            <div className="space-y-4">
              {opportunities.map(op => (
                <div key={op.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow relative z-0 hover:z-10 overflow-hidden">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${op.color} flex items-center justify-center text-white font-bold shadow-md`}>OP</div>
                    <div>
                      <div className="font-semibold text-slate-900">{op.title}</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-700">{op.org}</span>
                        <span className="text-xs text-slate-500">{op.date}</span>
                      </div>
                      {/* removed joined and seats details as requested */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => toggleWishlist(op)} aria-pressed={wishlist.includes(op.id)} className={`relative z-30 pointer-events-auto p-2 rounded-md transform transition-transform hover:scale-105 flex-shrink-0 ${wishlist.includes(op.id) ? 'bg-pink-50 text-pink-500' : 'bg-transparent text-slate-400 hover:bg-slate-100'}`}>
                      {wishlist.includes(op.id) ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9.2-6.67C.9 11.5 3.5 7 7.5 7c2 0 3 .9 4.5 2.4C13.5 7.9 14.5 7 16.5 7 20.5 7 23.1 11.5 21.2 14.33 19 16.65 12 21 12 21z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-7-4.35-9.2-6.67C.9 11.5 3.5 7 7.5 7c2 0 3 .9 4.5 2.4C13.5 7.9 14.5 7 16.5 7 20.5 7 23.1 11.5 21.2 14.33 19 16.65 12 21 12 21z" /></svg>
                      )}
                    </button>

                    {joined.includes(op.id) ? (
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={(e) => { e.stopPropagation(); leaveOpportunity(op); }} className="relative z-30 pointer-events-auto px-3 py-2 bg-rose-100 text-rose-600 rounded-md shadow-sm hover:bg-rose-200 transition flex-shrink-0 whitespace-nowrap">Leave</button>
                        <button disabled className="px-3 py-2 bg-slate-200 text-slate-600 rounded-md shadow-sm">Joined</button>
                      </div>
                    ) : (
                      <button type="button" onClick={(e) => { e.stopPropagation(); joinOpportunity(op); }} className="px-3 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-md shadow-sm hover:opacity-90 transition flex-shrink-0 whitespace-nowrap">Join</button>
                    )} 
                  </div>
                </div>
              ))}
            </div>

            {/* Right: wishlist */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">My Wishlist</h3>
              {wishlist.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">No items yet — tap the ❤ on any opportunity to add.</div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map(id => {
                    const op = opportunities.find(o => o.id === id);
                    if (!op) return null;
                    return (
                      <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700 relative z-50 overflow-hidden dark:border dark:border-slate-600">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{op.title}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-400">{op.org}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={(e) => { e.stopPropagation(); toggleWishlist(op); }} className="relative z-50 pointer-events-auto text-sm text-pink-500 flex-shrink-0 whitespace-nowrap">Remove</button>
                          {joined.includes(op.id) ? (
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={(e) => { e.stopPropagation(); leaveOpportunity(op); }} className="relative z-50 pointer-events-auto text-sm px-2 py-1 bg-rose-100 text-rose-600 rounded flex-shrink-0 whitespace-nowrap">Leave</button>
                              <button disabled className="text-sm px-2 py-1 bg-slate-200 text-slate-600 rounded">Joined</button>
                            </div>
                          ) : (
                            <button type="button" onClick={(e) => { e.stopPropagation(); joinOpportunity(op); }} className="relative z-50 pointer-events-auto text-sm px-2 py-1 bg-emerald-500 text-white rounded flex-shrink-0 whitespace-nowrap">Join</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}