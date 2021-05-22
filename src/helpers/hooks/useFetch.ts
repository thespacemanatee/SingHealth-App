import React from "react";
import { AxiosRequestConfig } from "axios";

import { httpClient } from "../CustomHTTPClient";
import { handleErrorResponse } from "../utils";

const useFetch = (url: string, options: AxiosRequestConfig) => {
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await httpClient(url, options);
        setResponse(res.data);
      } catch (err) {
        handleErrorResponse(err);
        setError(err);
      }
    };
    fetchData();
  }, []);
  return { response, error };
};

export default useFetch;
