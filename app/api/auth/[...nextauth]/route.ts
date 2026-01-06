import { handlers } from "../../../../auth" // Referring to auth.ts alias if configured, or relative path
console.log("🔹 /api/auth/[...nextauth] route hit");
export const { GET, POST } = handlers
