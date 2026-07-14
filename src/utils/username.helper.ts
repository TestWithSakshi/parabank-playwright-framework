/**
 * Username generation helper.
 *
 * Produces human-readable usernames in the form `Firstname_Lastname`
 * (e.g. `Sakshi_Jindal`). When uniqueness is required — which it is on
 * the shared Parabank instance, since usernames are globally unique and
 * cannot be deleted — a short random suffix is appended:
 * `Sakshi_Jindal_ab12`.
 *
 * The final username is capped at 20 characters. Parabank silently
 * truncates longer values server-side, which produces confusing
 * "username already exists" collisions on the shared demo instance.
 */
import { faker } from '@faker-js/faker';

const MAX_USERNAME_LENGTH = 20;
const SUFFIX_LENGTH = 5;

function sanitize(part: string): string {
  // Keep only letters/digits so the username stays valid across strict
  // apps; capitalise the first character for readability.
  const cleaned = part.replace(/[^A-Za-z0-9]/g, '');
  if (!cleaned) return 'User';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export interface UsernameOptions {
  unique?: boolean;
}

export function buildUsername(
  firstName: string,
  lastName: string,
  options: UsernameOptions = { unique: true }
): string {
  const first = sanitize(firstName);
  const last = sanitize(lastName);
  if (!options.unique) {
    return `${first}_${last}`.slice(0, MAX_USERNAME_LENGTH);
  }

  const suffix = faker.string.alphanumeric({ length: SUFFIX_LENGTH, casing: 'lower' });
  // Reserve room for `_<suffix>` and truncate first/last if needed so the
  // final username stays within the 20-char Parabank cap while still
  // reading as `Firstname_Lastname_xxxxx`.
  const suffixPart = `_${suffix}`;
  const nameBudget = MAX_USERNAME_LENGTH - suffixPart.length;
  let base = `${first}_${last}`;
  if (base.length > nameBudget) {
    // Preserve the first-name portion; trim the last name proportionally.
    const firstBudget = Math.min(first.length, Math.max(3, Math.floor(nameBudget / 2)));
    const lastBudget = nameBudget - firstBudget - 1;
    base = `${first.slice(0, firstBudget)}_${last.slice(0, Math.max(1, lastBudget))}`;
  }
  return `${base}${suffixPart}`.slice(0, MAX_USERNAME_LENGTH);
}

