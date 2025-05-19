export function getUserRole(): number | null {
  const role = localStorage.getItem('rol');
  return role ? parseInt(role) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
 
};