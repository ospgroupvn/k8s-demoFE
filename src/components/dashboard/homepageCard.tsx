import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

interface HomepageCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  isLoading?: boolean;
}

export const HomepageCard = ({
  title,
  value = 0,
  icon,
  color = "#057CCE",
  isLoading = false,
}: HomepageCardProps) => {
  return (
    <Card
      className={cn(
        "flex border border-[#DBEAFE] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        "rounded-xl overflow-hidden p-0 bg-white border-l-4"
      )}
      style={{ borderLeftColor: color }}
    >
      <CardContent className="flex items-center gap-4 py-4 px-6 h-full">
        <div
          className="flex items-center justify-center p-2 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm text-gray-500 font-medium mb-1">
            {title}
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              value.toLocaleString("vi-VN")
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
