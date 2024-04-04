import React from "react";
import GestureHandler from "./gesture";
import FaceHandler from "./face";

type Props = {
    children: React.ReactNode;
};

export default function Provider(props: Props) {
    return (
        <GestureHandler>
            <FaceHandler>{props.children}</FaceHandler>
        </GestureHandler>
    );
}
