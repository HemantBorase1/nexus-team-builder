// Static data storage and management
// Simulates localStorage for demo purposes

class StaticStorage {
  constructor() {
    const initial = {
      userProfile: null,
      userSkills: [],
      userAvailability: [],
      userProjects: [],
      userTeams: [],
      invitations: [],
      notifications: []
    };
    this.storageKey = "nexusStatic";
    this.data = initial;
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.data = { ...initial, ...parsed };
        } else {
          window.localStorage.setItem(this.storageKey, JSON.stringify(initial));
        }
      } catch (e) {
        // ignore parse errors; fall back to memory
      }
    }
  }

  save() {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      }
    } catch (e) {
      // ignore persistence errors for demo
    }
  }

  async delay(ms = 900) {
    await new Promise((res) => setTimeout(res, ms));
  }

  // User Profile Management
  setUserProfile(profile) {
    this.data.userProfile = profile;
    this.save();
    return { ok: true, data: profile };
  }

  async setUserProfileAsync(profile) {
    await this.delay();
    return this.setUserProfile(profile);
  }

  getUserProfile() {
    return { ok: true, data: this.data.userProfile };
  }

  // Skills Management
  setUserSkills(skills) {
    this.data.userSkills = skills;
    this.save();
    return { ok: true, data: skills };
  }

  async setUserSkillsAsync(skills) {
    await this.delay();
    return this.setUserSkills(skills);
  }

  getUserSkills() {
    return { ok: true, data: this.data.userSkills };
  }

  // Availability Management
  setUserAvailability(availability) {
    this.data.userAvailability = availability;
    this.save();
    return { ok: true, data: availability };
  }

  async setUserAvailabilityAsync(availability) {
    await this.delay();
    return this.setUserAvailability(availability);
  }

  getUserAvailability() {
    return { ok: true, data: this.data.userAvailability };
  }

  // Projects Management
  createProject(project) {
    const newProject = {
      id: `project-${Date.now()}`,
      ...project,
      createdAt: new Date().toISOString(),
      status: 'recruiting',
      progress: 0
    };
    this.data.userProjects.push(newProject);
    this.save();
    return { ok: true, data: newProject };
  }

  getUserProjects() {
    return { ok: true, data: this.data.userProjects };
  }

  async listProjectsAsync() {
    await this.delay();
    return this.getUserProjects();
  }

  async createProjectAsync(project) {
    await this.delay();
    return this.createProject(project);
  }

  updateProject(projectId, partial) {
    const idx = this.data.userProjects.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      this.data.userProjects[idx] = { ...this.data.userProjects[idx], ...partial };
      this.save();
      return { ok: true, data: this.data.userProjects[idx] };
    }
    return { ok: false, error: 'not_found' };
  }

  async updateProjectAsync(projectId, partial) {
    await this.delay();
    return this.updateProject(projectId, partial);
  }

  deleteProject(projectId) {
    const before = this.data.userProjects.length;
    this.data.userProjects = this.data.userProjects.filter((p) => p.id !== projectId);
    this.save();
    return { ok: true, data: { deleted: before !== this.data.userProjects.length } };
  }

  async deleteProjectAsync(projectId) {
    await this.delay();
    return this.deleteProject(projectId);
  }

  // Teams Management
  createTeam(team) {
    const newTeam = {
      id: `team-${Date.now()}`,
      ...team,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    this.data.userTeams.push(newTeam);
    this.save();
    return { ok: true, data: newTeam };
  }

  getUserTeams() {
    return { ok: true, data: this.data.userTeams };
  }

  // Invitations (simulate invite/pending)
  inviteUserToProject(userId, projectId) {
    const invite = {
      id: `invite-${Date.now()}`,
      userId,
      projectId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.data.invitations.push(invite);
    this.addNotification({
      type: 'invite',
      title: 'Invitation sent',
      message: `Invitation sent to ${userId}`
    });
    this.save();
    return { ok: true, data: invite };
  }

  getInvitations() {
    return { ok: true, data: this.data.invitations };
  }

  updateInvitation(inviteId, status) {
    const idx = this.data.invitations.findIndex((i) => i.id === inviteId);
    if (idx !== -1) {
      this.data.invitations[idx].status = status;
      this.save();
      return { ok: true, data: this.data.invitations[idx] };
    }
    return { ok: false, error: 'not_found' };
  }

  // Notifications
  addNotification(notification) {
    const newNotification = {
      id: `notif-${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };
    this.data.notifications.unshift(newNotification);
    this.save();
    return { ok: true, data: newNotification };
  }

  getNotifications() {
    return { ok: true, data: this.data.notifications };
  }

  markNotificationRead(notificationId) {
    const notification = this.data.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return { ok: true, data: notification };
  }

  // Clear all data
  clearAll() {
    this.data = {
      userProfile: null,
      userSkills: [],
      userAvailability: [],
      userProjects: [],
      userTeams: [],
      invitations: [],
      notifications: []
    };
    this.save();
    return { ok: true, data: null };
  }
}

// Create a singleton instance
const staticStorage = new StaticStorage();

export default staticStorage;




