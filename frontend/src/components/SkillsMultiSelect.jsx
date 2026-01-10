// src/components/SkillsMultiSelect.jsx
import React, { useState } from "react";

const skillsOptions = [
  "Web Development",
  "Graphic Design",
  "Teaching",
  "Event Management",
  "Social Media",
  "Content Writing",
  "Photography",
  "Translation",
  "Data Entry",
  "Research",
  "Counseling",
  "First Aid",
];

function SkillsMultiSelect({ value = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSkills = skillsOptions.filter((skill) =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSkill = (skill) => {
    const newValue = value.includes(skill)
      ? value.filter((s) => s !== skill)
      : [...value, skill];
    onChange(newValue);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Required Skills
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-xl text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex flex-wrap gap-2">
          {value.length === 0 && (
            <span className="text-gray-500 text-sm">
              Select required skills...
            </span>
          )}

          {value.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        <span className="text-xs text-gray-500 mt-1 block">
          {value.length}/{skillsOptions.length} skills selected
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          <input
            type="text"
            placeholder="Search skills..."
            className="w-full p-3 border-b border-gray-100 rounded-t-xl text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="p-3 space-y-2">
            {filteredSkills.map((skill) => (
              <label
                key={skill}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  className="rounded mr-3"
                  checked={value.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsMultiSelect;