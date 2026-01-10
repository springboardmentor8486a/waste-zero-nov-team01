import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Matches = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('score'); // 'score' or 'name'
  const navigate = useNavigate();

  // Determine if user is volunteer or NGO and fetch appropriate matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('wastezero_token');
        const currentUser = JSON.parse(localStorage.getItem('wastezero_user'));
        
        console.log('=== Starting match fetch ===');
        console.log('Current user:', currentUser);
        console.log('User role:', user?.role);
        console.log('Token present:', !!token);
        
        if (user?.role === 'ngo') {
          // For NGO: Fetch opportunities and matched volunteers
          console.log('\n[NGO MODE] Fetching opportunities...');
          const oppRes = await axios.get('http://localhost:5000/api/opportunities', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log(`✓ Got ${oppRes.data?.length || 0} total opportunities`);
          console.log('All opportunities:', oppRes.data);
          
          // Determine current user id (AuthContext may store `id` or `_id`)
          let currentUserId = currentUser?._id || currentUser?.id || user?._id || user?.id;
          // If still missing, fetch /api/users/me as a fallback to obtain the id
          if (!currentUserId) {
            try {
              const meRes = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
              });
              currentUserId = meRes.data?._id || meRes.data?.id;
              console.log('Fetched current user from API:', meRes.data);
            } catch (err) {
              console.warn('Could not fetch /api/users/me to resolve current user id', err?.response?.status || err.message);
            }
          }

          // Filter to only NGO's own opportunities
          const opportunities = (oppRes.data || []).filter(opp => {
            const oppOwnerId = opp.ngo_id?._id || opp.ngo_id?.id || opp.ngo_id;
            const isOwner = String(oppOwnerId) === String(currentUserId);
            console.log(`  - Opp "${opp.title}" (${opp._id}): ngo_id=${oppOwnerId}, owner match=${isOwner}`);
            return isOwner;
          });
          
          console.log(`\n✓ Filtered to ${opportunities.length} NGO's own opportunities`);
          const allMatches = [];

          // For each opportunity, fetch matched volunteers
          for (const opp of opportunities) {
            try {
              console.log(`\n  [Fetching matches] Opportunity: "${opp.title}" (${opp._id})`);
              console.log(`    Required skills: ${(opp.required_skills || []).join(', ')}`);
              console.log(`    Location: ${opp.location}`);
              
              const volRes = await axios.get(`http://localhost:5000/api/matches/${opp._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              console.log(`    ✓ Got ${volRes.data?.length || 0} matched volunteers`);
              if (volRes.data?.length > 0) {
                volRes.data.forEach(match => {
                  console.log(`      - ${match.volunteer?.name} (score: ${match.score})`);
                });
              }
              
              // Add opportunity info to each matched volunteer
              const volunteersWithOpp = volRes.data.map(match => ({
                ...match,
                opportunity: opp
              }));
              allMatches.push(...volunteersWithOpp);
            } catch (err) {
              console.error(`    ✗ Error fetching matches: ${err.response?.status}`, err.response?.data || err.message);
            }
          }

          console.log(`\n=== Total matches found: ${allMatches.length} ===`);
          console.log('All matches:', allMatches);
          setMatches(allMatches);
        } else {
          // For Volunteer: Fetch matched opportunities (original behavior)
          console.log('\n[VOLUNTEER MODE] Fetching opportunities...');
          const res = await axios.get('http://localhost:5000/api/matches', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`✓ Got ${res.data?.length || 0} matched opportunities`);
          setMatches(res.data || []);
        }
      } catch (err) {
        console.error("Fetch matches error:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role) {
      fetchMatches();
    }
  }, [user?.role]);

  // Sort matches
  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'score') {
      return (b.score || 0) - (a.score || 0);
    } else if (user?.role === 'ngo') {
      // For NGO, sort by volunteer name
      return (a.volunteer?.name || '').localeCompare(b.volunteer?.name || '');
    } else {
      // For volunteer, sort by opportunity title
      return (a.opportunity?.title || '').localeCompare(b.opportunity?.title || '');
    }
  });

  // Get match color based on score
  const getMatchColor = (score) => {
    if (score >= 3) return '#10b981'; // green
    if (score >= 2) return '#f59e0b'; // amber
    return '#3b82f6'; // blue
  };

  // Get match percentage (rough estimate)
  const getMatchPercentage = (score, maxScore = 5) => {
    return Math.min(Math.round((score / maxScore) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {user?.role === 'ngo' ? 'Finding volunteer matches...' : 'Finding perfect opportunities for you...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        {user?.role === 'ngo' ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Matched Volunteers</h1>
            <p className="text-gray-600">Found {matches.length} match(es) to your opportunities</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Matched Opportunities</h1>
            <p className="text-gray-600">We found {matches.length} opportunity(ies) that match your skills and location</p>
          </>
        )}
      </div>

      {/* Sort Controls */}
      {matches.length > 0 && (
        <div className="mb-6 flex gap-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="score">Best Match</option>
            <option value="name">
              {user?.role === 'ngo' ? 'Volunteer Name' : 'Opportunity Name'}
            </option>
          </select>
        </div>
      )}

      {/* Empty State */}
      {matches.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-5xl mb-4">🎯</div>
          {user?.role === 'ngo' ? (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No volunteer matches yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create opportunities to start matching with volunteers!
              </p>
              <button 
                onClick={() => navigate('/opportunities/create')} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Create an Opportunity
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No matches found yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find opportunities matching your skills and location. Try updating your profile to get better matches!
              </p>
              <button 
                onClick={() => navigate('/profile')} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Update Your Profile
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMatches.map((match, idx) => {
            const matchScore = match.score || 0;
            const matchPercent = getMatchPercentage(matchScore);
            const matchColor = getMatchColor(matchScore);
            const isNGO = user?.role === 'ngo';
            const volunteer = match.volunteer;
            const opp = match.opportunity || match;

            if (isNGO) {
              // NGO View: Show matched volunteer
              return (
                <div 
                  key={`${opp._id}-${volunteer._id}-${idx}`} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 flex flex-col"
                >
                  {/* Match Score Badge */}
                  <div className="relative bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">MATCH SCORE</p>
                        <div className="flex items-baseline gap-2">
                          <span 
                            className="text-3xl font-bold"
                            style={{ color: matchColor }}
                          >
                            {matchPercent}%
                          </span>
                          <span className="text-xs text-gray-500">({matchScore} factors)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {matchPercent >= 80 && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ EXCELLENT
                          </div>
                        )}
                        {matchPercent >= 60 && matchPercent < 80 && (
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                            👍 GOOD
                          </div>
                        )}
                        {matchPercent < 60 && (
                          <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-bold">
                            📌 POSSIBLE
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${matchPercent}%`, backgroundColor: matchColor }}
                      ></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-4 py-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {volunteer.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-700 font-medium">{volunteer.location}</p>
                      </div>
                    </div>

                    {/* Opportunity Info */}
                    <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-900 mb-1">MATCHED FOR OPPORTUNITY:</p>
                      <p className="text-sm font-medium text-emerald-800">{opp.title}</p>
                    </div>

                    {/* Match Reason */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2">WHY THIS MATCH:</p>
                      <div className="space-y-1">
                        {matchScore >= 2 && (
                          <p className="text-xs text-blue-800">✓ Skills alignment ({matchScore - 1} matching skills)</p>
                        )}
                        {matchScore % 2 === 1 && matchScore >= 1 && (
                          <p className="text-xs text-blue-800">✓ Location match</p>
                        )}
                        {matchScore === 0 && (
                          <p className="text-xs text-blue-800">📍 Available volunteer - consider for this opportunity</p>
                        )}
                      </div>
                    </div>

                    {/* Skills Tags */}
                    {volunteer.skills && volunteer.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">VOLUNTEER SKILLS:</p>
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.slice(0, 3).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {volunteer.skills.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
                              +{volunteer.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                    <button 
                      onClick={() => navigate(`/chat/${volunteer._id}`)}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                      💬 Chat
                    </button>
                  </div>
                </div>
              );
            } else {
              // Volunteer View: Show matched opportunity
              return (
                <div 
                  key={opp._id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 flex flex-col"
                >
                  {/* Match Score Badge */}
                  <div className="relative bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">MATCH SCORE</p>
                        <div className="flex items-baseline gap-2">
                          <span 
                            className="text-3xl font-bold"
                            style={{ color: matchColor }}
                          >
                            {matchPercent}%
                          </span>
                          <span className="text-xs text-gray-500">({matchScore} factors)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {matchPercent >= 80 && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ EXCELLENT
                          </div>
                        )}
                        {matchPercent >= 60 && matchPercent < 80 && (
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                            👍 GOOD
                          </div>
                        )}
                        {matchPercent < 60 && (
                          <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-bold">
                            📌 POSSIBLE
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${matchPercent}%`, backgroundColor: matchColor }}
                      ></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-4 py-4 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {opp.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-700 font-medium">{opp.location}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4 4 0 00-4-4h-2.5a4 4 0 00-4 4v1h10.5z" />
                        </svg>
                        <p className="text-sm text-gray-700 font-medium">{opp.ngo_id?.name || "WasteZero Partner"}</p>
                      </div>
                    </div>

                    {/* Match Reason */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-900 mb-2">WHY THIS MATCH:</p>
                      <div className="space-y-1">
                        {matchScore > 1 && (
                          <p className="text-xs text-blue-800">✓ Skills alignment ({matchScore - 1} matching skills)</p>
                        )}
                        {matchScore > 0 && (
                          <p className="text-xs text-blue-800">✓ Location match</p>
                        )}
                      </div>
                    </div>

                    {/* Skills Tags */}
                    {opp.required_skills && opp.required_skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">REQUIRED SKILLS:</p>
                        <div className="flex flex-wrap gap-1">
                          {opp.required_skills.slice(0, 3).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {opp.required_skills.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
                              +{opp.required_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                    <button 
                      onClick={() => navigate(`/opportunities/${opp._id}`)}
                      className="flex-1 px-4 py-2 bg-white border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate(`/chat/${opp.ngo_id?._id}`)}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                      💬 Chat
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;