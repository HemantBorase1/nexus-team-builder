// Lightweight validation helpers (JS only)

function isString(v, { min = 0, max = 2048 } = {}) {
  return typeof v === 'string' && v.length >= min && v.length <= max;
}

function isInt(v, { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {}) {
  return Number.isInteger(v) && v >= min && v <= max;
}

function isBool(v) { return v === true || v === false; }

function isArray(v, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  return Array.isArray(v) && v.length >= min && v.length <= max;
}

export function validateUserProfile(input) {
  const errors = {};
  if (!isString(input.full_name, { min: 1, max: 120 })) errors.full_name = 'Full name is required';
  if (input.faculty && !isString(input.faculty, { min: 2, max: 120 })) errors.faculty = 'Invalid faculty';
  if (input.year != null && !isInt(input.year, { min: 1, max: 8 })) errors.year = 'Year must be 1-8';
  if (input.avatar_url && !isString(input.avatar_url, { min: 5, max: 2048 })) errors.avatar_url = 'Invalid avatar URL';
  if (input.bio && !isString(input.bio, { min: 0, max: 1000 })) errors.bio = 'Bio too long';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProjectCreate(input) {
  const errors = {};
  if (!isString(input.name, { min: 2, max: 200 })) errors.name = 'Project name required';
  if (input.type && !isString(input.type, { min: 2, max: 120 })) errors.type = 'Invalid type';
  if (input.description && !isString(input.description, { min: 0, max: 5000 })) errors.description = 'Description too long';
  if (input.team_size != null && !isInt(input.team_size, { min: 1, max: 20 })) errors.team_size = 'Team size 1-20';
  if (input.requirements && !isArray(input.requirements, { min: 0, max: 100 })) errors.requirements = 'Invalid requirements';
  if (Array.isArray(input.requirements)) {
    input.requirements.forEach((r, i) => {
      if (!isInt(r.skill_id, { min: 1 })) errors[`requirements[${i}].skill_id`] = 'Invalid skill id';
      if (!isInt(r.required_level, { min: 1, max: 5 })) errors[`requirements[${i}].required_level`] = 'Level 1-5';
    });
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSkillLevels(skills) {
  const errors = {};
  if (!isArray(skills, { min: 0, max: 200 })) return { valid:false, errors:{ skills:'Invalid skills array' } };
  skills.forEach((s, i) => {
    if (!isInt(s.skill_id, { min: 1 })) errors[`skills[${i}].skill_id`] = 'Invalid skill id';
    if (!isInt(s.level, { min: 1, max: 5 })) errors[`skills[${i}].level`] = 'Level must be 1-5';
  });
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAvailabilitySlots(slots) {
  const errors = {};
  if (!isArray(slots, { min: 0, max: 300 })) return { valid:false, errors:{ slots:'Invalid slots' } };
  slots.forEach((s, i) => {
    if (!isInt(s.day_of_week, { min: 0, max: 6 })) errors[`slots[${i}].day_of_week`] = 'Day 0-6';
    if (!isString(s.start_time, { min: 4, max: 8 })) errors[`slots[${i}].start_time`] = 'Invalid start';
    if (!isString(s.end_time, { min: 4, max: 8 })) errors[`slots[${i}].end_time`] = 'Invalid end';
  });
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateTeamFormation(input) {
  const errors = {};
  if (!isInt(input.team_size, { min: 1, max: 20 })) errors.team_size = 'Team size 1-20';
  if (!isArray(input.user_ids, { min: 1, max: 20 })) errors.user_ids = 'Invalid user list';
  return { valid: Object.keys(errors).length === 0, errors };
}


