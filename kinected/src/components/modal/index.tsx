import { useFaceStore } from "@/stores/faces.store";
import { putFirstname } from "@/utils/requests/user/put-firstname";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import Check from "@/../public/Check square.svg";
import Close from "@/../public/Close square.svg";
import Arrow from "@/../public/arrow.svg";

type Props = {
    children: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function Modal(props: Props) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex justify-between items-center"
        >
            <div
                onClick={props.onCancel}
                className="hover:scale-110 origin-left animation-all duration-500 size-40 p-4 border-solid border-4 border-white text-white rounded-full relative flex flex-col items-center justify-center"
            >
                <Close className="size-16" />
                <span className="font-medium text-xl">Non</span>
                <div className="absolute size-12 rounded-full shadow bg-white -right-0 translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <Arrow className="size-8 rotate-180 text-black" />
                </div>
            </div>
            {props.children}
            <div
                onClick={props.onConfirm}
                className="hover:scale-110 origin-right animation-all duration-500 size-40 p-4 border-solid border-4 border-white text-white rounded-full relative flex flex-col items-center justify-center"
            >
                <Check className="size-16" />
                <span className="font-medium text-xl">Oui</span>
                <div className="absolute size-12 rounded-full shadow bg-white -left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <Arrow className="size-8 text-black" />
                </div>
            </div>
        </motion.div>
    );
}
