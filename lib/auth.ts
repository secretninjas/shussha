export const ALLOWED_DOMAIN = "secretninjas.nl";

export const isAllowedEmail = (email?: string | null) =>
  !!email?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`);
