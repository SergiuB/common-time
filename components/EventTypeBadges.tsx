import { colorVariants } from "@/constants";
import { Badge } from "./ui/badge";

interface Props {
  badgeStr: string;
}

export const EventTypeBadges = ({ badgeStr }: Props) => {
  const badges = badgeStr.split(",").map((badgeInfoStr) => {
    const [text, color] = badgeInfoStr.trim().split("|");
    return {
      text,
      color,
    };
  });
  return (
    <div className="flex gap-2">
      {badges.map(({ text, color }) => (
        <Badge key={text} style={{ backgroundColor: colorVariants[color] }}>
          {text}
        </Badge>
      ))}
    </div>
  );
};
