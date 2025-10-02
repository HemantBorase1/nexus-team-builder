// Static data for Nexus Team Builder - No backend required
// JavaScript only (no TypeScript)

// Re-export static data for backward compatibility
export {
  getCurrentUser as users,
  getAllProjects as sampleProjects,
  getAllSkills as skillsCatalog,
  getAllFaculties as faculties,
  getCurrentUser,
  getAllUsers,
  getAllProjects,
  getUserTeams,
  getAllSkills,
  getAllFaculties,
  getNotifications,
  getAnalytics,
  getMatchingUsers,
  getRecommendedProjects,
  calculateCompatibility,
  getFacultyColor,
  getFacultyName
} from "../data/static-data";

// Legacy compatibility functions
import { getAllUsers, getAllFaculties, calculateCompatibility } from "../data/static-data";

export const getUserById = (id) => {
  return getAllUsers().find(user => user.id === id);
};

export const getFacultyMeta = (facultyId) => {
  const faculty = getAllFaculties().find(f => f.id === facultyId);
  return faculty || { id: facultyId, name: 'Unknown', color: '#8B5CF6' };
};

export const compatibilityBetween = (user1, user2) => {
  return calculateCompatibility(user1, user2);
};

export const prebuiltTeams = [];


