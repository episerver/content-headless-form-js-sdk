import { useNavigate, useLocation } from 'react-router-dom';

export const useHistoryCompatible = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (path: any, state: any) => navigate(path, { state }),
    replace: (path: any, state: any) => navigate(path, { replace: true, state }),
    location: location,
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
  };
};