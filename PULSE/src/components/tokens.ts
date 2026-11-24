export const SLIDE_W = 1920;
export const SLIDE_H = 1080;

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
