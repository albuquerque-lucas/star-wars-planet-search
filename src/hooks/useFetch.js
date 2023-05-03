import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (erro) {
        setError(erro);
      }
    }

    fetchData();
  }, [url]);

  return { data, error };
}

export default useFetch;
