
import { cn } from "@/lib/utils";

type HobbyType = 'sports' | 'arts' | 'music' | 'tech' | 'outdoors' | 'food' | 'other';

interface HobbyTagProps {
  name: string;
  type: HobbyType;
  selected?: boolean;
  onClick?: () => void;
}

const HobbyTag = ({ name, type, selected = false, onClick }: HobbyTagProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium transition-all",
        `hobby-${type} text-white opacity-90`,
        selected ? "ring-2 ring-offset-2 ring-primary" : "hover:opacity-100",
        onClick ? "cursor-pointer" : "cursor-default"
      )}
    >
      {name}
    </button>
  );
};

export default HobbyTag;
