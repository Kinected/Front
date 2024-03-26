import React from "react";
import clsx from "clsx";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
};

export default function Button(props: Props) {
    return (
        <button
            onClick={() => props.onClick && props.onClick()}
            className={clsx(
                "py-2 px-4 bg-white rounded-2xl after:top-0 after:left-0 after:bg-white after:opacity-0 hover:after:opacity-80 after:rounded-2xl after:absolute after:w-full after:h-full relative after:transition-all after:duration-500 transition-all duration-500 hover:scale-110",
                props.className && props.className
            )}
        >
            <div className="flex items-center justify-center gap-2 font-medium">
                {props.children}
            </div>
        </button>
    );
}
