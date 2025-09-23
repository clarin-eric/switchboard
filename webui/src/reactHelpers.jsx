import React from 'react';
import {
  RouterProvider,
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
      <RouterProvider {...props}
          router={{ location, navigate, params }}>
        <Component />
      </RouterProvider>
    );
  }

  return ComponentWithRouterProp;
}