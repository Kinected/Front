import React from "react";
import { useUserFaces } from "@/hooks/useUserFaces";

type GestureHandlerProps = {
    children: React.ReactNode;
};

const GestureHandler = (props: GestureHandlerProps) => {
    useUserFaces();
    return <>{props.children}</>;
};

export default GestureHandler;
