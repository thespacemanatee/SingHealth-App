import { useState, useEffect } from "react";

import { httpClient, endpoint } from "../CustomHTTPClient";
import { handleErrorResponse } from "../utils";

export default (tenantID: string) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await httpClient(`${endpoint}tenant`, {
          params: {
            tenantID,
          },
        });
        setResponse(data.data);
      } catch (err) {
        setError(err);
        handleErrorResponse(err);
      }
    };
    if (tenantID) {
      fetchData();
    }
  }, [tenantID]);
  return { response, error };
};
