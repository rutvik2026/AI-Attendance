import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const StudentProtectedRoute = ({ children }) => {
  const cust = sessionStorage.getItem("cust");
  const navigate = useNavigate();
  const { role } = cust ? JSON.parse(cust) : {};

  useEffect(() => {
    if (role !== "student") {
      navigate("/", { replace: true }); 
    }
  }, [role, navigate]);

  if (role !== "student") {
    return null; 
  }

  return children;
};

StudentProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StudentProtectedRoute;
