import { useState, useEffect } from "react";

import { httpClient, endpoint } from "../CustomHTTPClient";
import { handleErrorResponse } from "../utils";

export default (fileName: string) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await httpClient(`${endpoint}images/download-url`, {
          params: {
            fileName,
          },
        });
        setResponse(data.data);
      } catch (err) {
        setError(err);
        handleErrorResponse(err);
      }
    };
    if (fileName) {
      fetchData();
    }
  }, [fileName]);
  return { response, error };
};
