import React from "react";
import { useGestures } from "@/hooks/useGestures";
import { Swipes, useGesturesStore } from "@/stores/gestures.store";

type GestureHandlerProps = {
    children: React.ReactNode;
};

const GestureHandler = (props: GestureHandlerProps) => {
    const actionsOnSwipe = useGesturesStore((state) => state.actionsOnSwipe);
    const gesturesData = useGestures();

    if (gesturesData && actionsOnSwipe[gesturesData.swipe as Swipes]) {
        actionsOnSwipe[gesturesData.swipe as Swipes]();
    }

    return <>{props.children}</>;
};

export default GestureHandler;
