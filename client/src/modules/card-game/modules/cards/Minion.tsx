import { ReactNode, useState } from "react";
import { Card as CardI } from "../../core/cards/card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MinionProps {
  onClickCard?: (card: CardI) => void;
  card: CardI;
}

export const Minion = ({ onClickCard, card }: MinionProps) => {
  return (
    <AnimatedCard
      className="p-2 "
      key={card.id}
      onClick={() => onClickCard?.(card)}
    >
      <div className="w-60 h-32 gradient " />
      <div className="pt-4 ps-8">
        <div className="text-xl">{card.name}</div>
        <div className="text-base">{card.description}</div>
      </div>
    </AnimatedCard>
  );
};

interface AnimatedCardProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const AnimatedCard = ({ children, ...rest }: AnimatedCardProps) => {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y - rect.height / 2) / 3;
    const rotateY = (x - rect.width / 2) / -3;

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "transform 0.1s ease",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "rotateX(0) rotateY(0)",
      transition: "transform 0.5s ease",
    });
  };

  return (
    <Card style={style} className={cn("card", rest.className)} {...rest}>
      <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </Card>
  );
};
