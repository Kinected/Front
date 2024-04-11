import { useEffect, useState } from "react";
import { useTeethTimerStore } from "@/stores/teethTimerStore.store";

type UseTeethTimerArgs = {
  initialTime?: number;
  isDefaultRunning?: boolean;
};

export const useTeethTimer = ({
  initialTime,
  isDefaultRunning,
}: UseTeethTimerArgs) => {
  const updateIsRunning = useTeethTimerStore((state) => state.updateIsRunning);
  const updateTime = useTeethTimerStore((state) => state.updateTime);

  const [time, setTime] = useState<number>(initialTime || 180);
  const [isRunning, setIsRunning] = useState<boolean>(
    isDefaultRunning || false,
  );

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const toggleTimer = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
    updateIsRunning(!isRunning);
  };

  const resetTimer = (value?: number) => {
    setTime(value || 180);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            setIsRunning(false);
            updateIsRunning(false);
            updateTime(initialTime || 180);
            return initialTime || 180;
          }

          updateTime(prevTime - 1);
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return {
    timerTime: time,
    formattedTime : formatTime(time),
    isRunning,
    toggleTimer,
    resetTimer,
  };
};
