/** The http origin of the backend server */
export const BACKEND = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin; 

export function staticFilePath(filename: string) {
  return `${BACKEND}/static/${filename}`;
}
