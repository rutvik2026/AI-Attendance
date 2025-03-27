import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      
      if (location.pathname !== "/register") {
        navigate("/", { replace: true });
      }
    }
  }, [navigate, token, location.pathname]); 

  if (!token && location.pathname !== "/register") {
    return null;
  }

  return children;
};

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protected;
