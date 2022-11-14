import React from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

  React.useEffect(() => {
    _paq.push(['setCustomUrl', window.location.href]);
    _paq.push(['trackPageView']);
  }, [location]);

    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}