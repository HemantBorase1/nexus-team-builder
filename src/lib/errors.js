export class AuthError extends Error {
  constructor(message, meta = {}) {
    super(message);
    this.name = "AuthError";
    this.code = meta.code;
  }
}

export function formatError(err) {
  if (!err) return { title: "Unknown error", description: "No error details available." };
  if (err instanceof AuthError) {
    return { title: "Authentication error", description: err.message };
  }
  if (err instanceof Error) {
    return { title: err.name || "Error", description: err.message };
  }
  if (typeof err === "string") return { title: "Error", description: err };
  try {
    return { title: "Error", description: JSON.stringify(err) };
  } catch (_e) {
    return { title: "Error", description: String(err) };
  }
}

export function mapDbErrorToMessage(error) {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('foreign key')) return { title:'Invalid reference', description:'One of the referenced items does not exist.' };
  if (msg.includes('unique')) return { title:'Already exists', description:'A record with these details already exists.' };
  if (msg.includes('violates check')) return { title:'Invalid input', description:'Some values are out of allowed range.' };
  return { title:'Database error', description: error?.message || 'Unknown database error.' };
}


