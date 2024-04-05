import React from "react";
import GestureHandler from "./gesture";
import FaceHandler from "./face";
import SensorsHandler from "./sensors";

type Props = {
    children: React.ReactNode;
};

export default function Provider(props: Props) {
    return (
        <SensorsHandler>
            <GestureHandler>
                <FaceHandler>{props.children}</FaceHandler>
            </GestureHandler>
        </SensorsHandler>
    );
}
