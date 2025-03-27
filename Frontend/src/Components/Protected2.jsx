import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const cust = sessionStorage.getItem("cust");
  const navigate = useNavigate();
  const { role } = cust ? JSON.parse(cust) : {};

  useEffect(() => {
    if (role) {
      navigate(
        role === "admin" || role === "teacher" ? "/home" : "/studenthome",
        { replace: true }
      );
    }
  }, [role, navigate]);

  if (role) {
    return null; // Prevent rendering if user is logged in
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
