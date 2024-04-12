import { useEffect, useState } from "react";
import { useTeethTimerStore } from "@/stores/teethTimerStore.store";

type UseTeethTimerArgs = {
  initialTime?: number;
  isDefaultRunning?: boolean;
  isDefaultFinished?: boolean;
};

const DEFAULT_TIME = 10;
export const useTeethTimer = ({
  initialTime,
  isDefaultRunning,
  isDefaultFinished,
}: UseTeethTimerArgs) => {
  const updateIsRunning = useTeethTimerStore((state) => state.updateIsRunning);
  const toggleIsRunning = useTeethTimerStore((state) => state.toggleIsRunning);
  const updateTime = useTeethTimerStore((state) => state.updateTime);
  const updateIsFinished = useTeethTimerStore(
    (state) => state.updateIsFinished,
  );

  const [time, setTime] = useState<number>(initialTime || DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState<boolean>(
    isDefaultRunning || false,
  );
  const [isFinished, setIsFinished] = useState<boolean>(
    isDefaultFinished || false,
  );

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const toggleTimer = () => {
    if (isFinished) {
      resetTimer();
      return;
    }

    setIsRunning((prevIsRunning) => !prevIsRunning);
    toggleIsRunning();
  };

  const resetTimer = (value?: number) => {
    updateTime(value || DEFAULT_TIME);
    setTime(value || DEFAULT_TIME);
    updateIsFinished(false);
    setIsFinished(false);
    updateIsRunning(false);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            setIsRunning(false);
            updateIsRunning(false);

            setIsFinished(true);
            updateIsFinished(true);

            return initialTime || DEFAULT_TIME;
          }

          updateTime(prevTime - 1);
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, isFinished]);

  return {
    timerTime: time,
    formattedTime: formatTime(time),
    isRunning,
    isFinished,
    toggleTimer,
    resetTimer,
  };
};
