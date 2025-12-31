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

  // NGO owner aithe edit/delete chupinchu
  const isOwnerOpp = isOwner || opportunity.ngoId === user?._id;

  const handleEdit = () => {
    // route ni nī app path ki match cheyyali
    // /ngo/opportunities... ani unte kindha line vadali
    navigate(`/ngo/opportunities/${opportunity._id}/edit`);
    // if nī routes plain /opportunities/:id/edit aithe:
    // navigate(/opportunities/${opportunity._id}/edit);
  };

  const handleView = () => {
    // same base path use cheyyi
    navigate(`/ngo/opportunities/${opportunity._id}`);
    // or: navigate(/opportunities/${opportunity._id});
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 border border-gray-100 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {opportunity.title}
        </h3>
        <Badge status={opportunity.status}>{opportunity.status}</Badge>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {opportunity.description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            Location:
          </span>
          <span className="text-sm font-semibold">
            {opportunity.location}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-500">
            Skills:
          </span>
          {opportunity.requiredSkills?.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
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

        <span className="text-sm text-gray-500">
          By {opportunity.ngoName}
        </span>
      </div>
    </div>
  );
}