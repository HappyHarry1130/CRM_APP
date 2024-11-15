import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Target,
  Globe,
  Rocket,
  Edit,
  Sparkles,
  Check,
  X,
} from "lucide-react";

const STAGES = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
];

const PITCH_SECTIONS = [
  { id: "problem", title: "Problem" },
  { id: "solution", title: "Solution" },
  { id: "unique-value", title: "Unique Value & Features" },
  { id: "competition", title: "Competition" },
];

export function ProfilePage({
  user,
  onUpdateUser,
}: {
  user: any;
  onUpdateUser: any;
}) {
  console.log(user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    companyName: user.company.name,
    location: user.company.location,
    stage: user.company.stage,
    industry: user.company.industry,
    website: user.company.website,
  });

  const [editedPitch, setEditedPitch] = useState({
    problem: user.companyDetails.problem,
    solution: user.companyDetails.solution,
    "unique-value": user.companyDetails.uniqueValue,
    competition: user.companyDetails.competition,
  });

  const [tempInfo, setTempInfo] = useState(editedInfo);
  const [tempPitch, setTempPitch] = useState(editedPitch);

  const handleSave = () => {
    setEditedInfo(tempInfo);
    setEditedPitch(tempPitch);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempInfo(editedInfo);
    setTempPitch(editedPitch);
    setIsEditing(false);
  };

  const handlePitchChange = (sectionId: string, value: string) => {
    setTempPitch((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string,
    field: keyof typeof tempInfo
  ) => {
    const Icon = icon;
    return (
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-lg">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          {isEditing ? (
            field === "stage" ? (
              <select
                value={tempInfo[field]}
                onChange={(e) =>
                  setTempInfo((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={tempInfo[field]}
                onChange={(e) =>
                  setTempInfo((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )
          ) : field === "website" ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              {value}
            </a>
          ) : (
            <p className="font-medium">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {renderField(
              <Building2 className="w-5 h-5 text-blue-600" />,
              "Company Name",
              editedInfo.companyName,
              "companyName"
            )}
            {renderField(
              <MapPin className="w-5 h-5 text-blue-600" />,
              "Location",
              editedInfo.location,
              "location"
            )}
            {renderField(
              <Target className="w-5 h-5 text-blue-600" />,
              "Stage",
              editedInfo.stage,
              "stage"
            )}
          </div>
          <div className="space-y-4">
            {renderField(
              <Sparkles className="w-5 h-5 text-blue-600" />,
              "Industry",
              editedInfo.industry,
              "industry"
            )}
            {renderField(
              <Globe className="w-5 h-5 text-blue-600" />,
              "Website",
              editedInfo.website,
              "website"
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Rocket className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Pitch</h3>
        </div>
        <div className="space-y-6">
          {PITCH_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
            >
              <h4 className="font-medium text-gray-900 mb-2">
                {section.title}
              </h4>
              {isEditing ? (
                <textarea
                  value={tempPitch[section.id]}
                  onChange={(e) =>
                    handlePitchChange(section.id, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  rows={4}
                  placeholder={`Enter ${section.title.toLowerCase()}...`}
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-line">
                  {editedPitch[section.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
