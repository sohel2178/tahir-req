import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Location } from "@/types/report";

type Props = {
  data: Location[];
  playing: boolean;
  speed: number;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
};

export function useMarkerPlayback({
  data,
  playing,
  speed,
  index,
  setIndex,
}: Props) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!playing || data.length === 0) return;

    timer.current = setInterval(() => {
      setIndex((prev: number) => {
        if (prev >= data.length - 1) {
          clearInterval(timer.current!);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, data.length, setIndex]);
}
