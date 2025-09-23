import React from 'react';
import {
  BrowserRouter,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    React.useEffect(() => {
      if (window && window._paq) {
        window._paq.push(['setCustomUrl', window.location.href]);
        window._paq.push(['trackPageView']);
      }
    }, [location]);

    return (
      <BrowserRouter {...props}
          router={{ location, navigate, params }}>
        <Component />
      </BrowserRouter>
    );
  }

  return ComponentWithRouterProp;
}