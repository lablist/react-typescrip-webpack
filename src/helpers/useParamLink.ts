import { useNavigate, createSearchParams } from 'react-router-dom';

export default function useParamLink() {
  const navigate = useNavigate();

  return (url: string, params: Record<string, string | string[]>) => {
    const searchParams = createSearchParams(params).toString();
    navigate(url + '?' + searchParams);
  };
}
