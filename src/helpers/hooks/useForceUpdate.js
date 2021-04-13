import React, { useState } from "react";

function useForceUpdate() {
  const [, forceUpdate] = useState();

  return React.useCallback(() => {
    forceUpdate((s) => !s);
  }, []);
}

export default useForceUpdate;
