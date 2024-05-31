import { useSearchParams } from "react-router-dom";

function usePagination(defaultSize = 10) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 0;
  const size = parseInt(searchParams.get('size')) || defaultSize;

  const setPage = (newPage) => {
    if (newPage > -1) {
      setSearchParams({ page: newPage.toString(), size: size.toString() }, { replace: true });
    }
  }

  const setSize = (newSize) => {
    if (newSize > -1) {
      setSearchParams({ page: page.toString(), size: newSize.toString() }, { replace: true });
    }
  }

  return { page, size, setPage, setSize };
}

export default usePagination;
