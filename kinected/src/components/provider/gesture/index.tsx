import React, { useEffect, useState } from "react";
import { useUserActions } from "@/hooks/useUserActions";
import { Actions, useUserActionsStore } from "@/stores/gestures.store";

type GestureHandlerProps = {
  children: React.ReactNode;
};

const GestureHandler = (props: GestureHandlerProps) => {
  const [lastAction, setLastAction] = useState<Actions>("none");
  const actionsOnSwipe = useUserActionsStore((state) => state.effectOnAction);

  const gesturesData = useUserActions();

  useEffect(() => {
    if (
      gesturesData &&
      actionsOnSwipe[gesturesData.action as Actions] &&
      lastAction !== gesturesData.action
    ) {
      // console.log("--------------------");
      // console.log("Executing action", gesturesData.action);
      // console.log("on page", window.location.pathname);

      setLastAction(gesturesData.action as Actions);
      actionsOnSwipe[gesturesData.action as Actions]();
    }
  }, [gesturesData, actionsOnSwipe, lastAction]);

  return <>{props.children}</>;
};

export default GestureHandler;
