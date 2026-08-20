import React, { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Card that fires a four-way "plus" burst animation from the click point.
 * The pasted source arrived with its JSX stripped, so the markup is
 * reconstructed from the keyframes it shipped with.
 */
const ClickTrigger = ({ className }: { className?: string }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);
  };

  const bar = "absolute bg-primary" as const;
  const base: React.CSSProperties = {
    left: clickPosition.x,
    top: clickPosition.y,
    transform: "translate(-50%, -50%)",
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "surface-card relative flex min-h-56 w-full cursor-pointer select-none items-center justify-center overflow-hidden p-8",
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">Click anywhere on this card</p>

      {isClicked ? (
        <>
          <span
            className={cn(bar, "h-8 w-1 rounded-full")}
            style={{ ...base, animation: "clickSlideUp 600ms ease-out forwards" }}
          />
          <span
            className={cn(bar, "h-1 w-8 rounded-full")}
            style={{ ...base, animation: "clickSlideRight 600ms ease-out forwards" }}
          />
          <span
            className={cn(bar, "h-8 w-1 rounded-full")}
            style={{ ...base, animation: "clickSlideDown 600ms ease-out forwards" }}
          />
          <span
            className={cn(bar, "h-1 w-8 rounded-full")}
            style={{ ...base, animation: "clickSlideLeft 600ms ease-out forwards" }}
          />
        </>
      ) : null}

      <style>{`
        @keyframes clickSlideUp {
          0% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translateY(-40px); opacity: 0; }
        }
        @keyframes clickSlideRight {
          0% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translateX(40px); opacity: 0; }
        }
        @keyframes clickSlideDown {
          0% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translateY(40px); opacity: 0; }
        }
        @keyframes clickSlideLeft {
          0% { opacity: 1; }
          100% { transform: translate(-50%, -50%) translateX(-40px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ClickTrigger;
