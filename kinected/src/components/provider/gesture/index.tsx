import React, { useEffect } from "react";
import { useUserActions } from "@/hooks/useUserActions";
import { Actions, useUserActionsStore } from "@/stores/gestures.store";

type GestureHandlerProps = {
  children: React.ReactNode;
};

const GestureHandler = (props: GestureHandlerProps) => {
  const actionsOnSwipe = useUserActionsStore((state) => state.effectOnAction);

  const gesturesData = useUserActions();

  useEffect(() => {
    if (gesturesData && actionsOnSwipe[gesturesData.action as Actions]) {
      actionsOnSwipe[gesturesData.action as Actions]();
    }
  }, [gesturesData, actionsOnSwipe]);

  return <>{props.children}</>;
};

export default GestureHandler;
