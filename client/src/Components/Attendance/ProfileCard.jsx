import React from "react";

const ProfileCard = ({ name, position, workingDays, imageSrc }) => {
  return (
    <div className="bg-orange-600 text-white rounded-xl shadow-lg p-3 w-85 flex items-center space-x-6">
      <img
        src={imageSrc}  
        alt="profile"
        className="w-12 h-12 rounded-full border-2 border-white mb-5"
      />
      <div>
        <h5 className="text-l font-bold">{name}</h5>
        <p className="text-sm">{position}</p>
        <p className="text-sm mt-2">Total Working Day: {workingDays} DAYS</p>
      </div>
    </div>
  );
};

export default ProfileCard;
