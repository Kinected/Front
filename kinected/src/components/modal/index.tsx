import { motion } from "framer-motion";
import React from "react";
import Check from "../../icons/actions/Confirm.svg";
import Close from "../../icons/actions/Cancel.svg";
import ConfirmButton from "@/components/modal/ConfirmButton";
import { useUserActionsStore } from "@/stores/gestures.store";

type Props = {
  children: React.ReactNode;

  onConfirm: () => void;
  onCancel: () => void;
};

export default function Modal(props: Props) {
  const current_action = useUserActionsStore((state) => state.current_action);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex justify-between items-center"
    >
      <ConfirmButton
        onClick={props.onCancel}
        icon={<Close className="size-16" />}
        text={"Non"}
        position={"left"}
        isHover={current_action === "hover_right"}
      />

      {props.children}

      <ConfirmButton
        onClick={props.onCancel}
        icon={<Check className="size-16" />}
        text={"Oui"}
        position={"right"}
        isHover={current_action === "hover_left"}
      />
    </motion.div>
  );
}
