import React from "react";

function useForceUpdate() {
  const [, forceUpdate] = React.useState();

  return React.useCallback(() => {
    forceUpdate((s) => !s);
  }, []);
}

export default useForceUpdate;
