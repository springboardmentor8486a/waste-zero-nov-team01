// src/components/OpportunityCard.jsx
import Badge from "./Badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OpportunityCard({
  opportunity,
  isOwner = false,
  onDelete,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Determine ownership safely: support multiple field names and avoid treating
  // two undefined values as equal (which previously made buttons visible)
  const ownerId =
    opportunity?.ngo_id?._id || opportunity?.ngo_id || opportunity?.ngoId ||
    opportunity?.ngoId?._id;
  const currentUserId = user?.id || user?._id;
  const isOwnerOpp = isOwner || (ownerId && currentUserId && String(ownerId) === String(currentUserId));

  const handleEdit = () => {
    
    navigate(`/ngo/opportunities/${opportunity._id}/edit`);
   
  };

  const handleView = () => {
    // same base path use cheyyi
    navigate(`/ngo/opportunities/${opportunity._id}`);
    // or: navigate(/opportunities/${opportunity._id});
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl p-6 border border-gray-100 dark:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
          {opportunity.title}
        </h3>
        <Badge status={opportunity.status}>{opportunity.status}</Badge>
      </div>

      <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-3">
        {opportunity.description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
            Location:
          </span>
          <span className="text-sm font-semibold">
            {opportunity.location}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
            Skills:
          </span>
          {opportunity.requiredSkills?.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t dark:border-slate-700">
        <div className="flex gap-2">
          <button
            onClick={handleView}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>

          {isOwnerOpp && (
            <>
              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(opportunity._id)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        <span className="text-sm text-gray-500 dark:text-slate-400">
          By {opportunity.ngoName}
        </span>
      </div>
    </div>
  );
}