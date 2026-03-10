import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change instantly
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <>{children}</>;
};

export default RouteTransition;
