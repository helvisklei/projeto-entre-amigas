import { Navigate } from "react-router-dom";

/**
 * A route component that protects other routes by ensuring the user is authenticated.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child nodes to render if the user is authenticated.
 * @returns {React.ReactNode} The rendered component.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

//import { Navigate } from 'react-router-dom';

/*export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('auth_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
 */
