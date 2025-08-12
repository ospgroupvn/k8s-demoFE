import { cn } from "@/lib/utils";
import { getYear, subYears } from "date-fns";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  title: string;
  value: number;
  isLoading?: boolean;
  color?: string;
  percentage?: string;
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  value,
  isLoading = false,
  color,
  percentage,
  onClick,
}: Props) => {
  const previousYear = getYear(subYears(new Date(), 1));

  return (
    <Card
      className={cn(
        "bg-white shadow-md hover:shadow-xl transition-shadow basis-0 grow flex flex-col justify-between max-sm:min-w-[150px] rounded-none",
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "text-2xl font-bold text-default-blue flex flex-col items-left pt-4",
          !color ? "text-default-blue" : ""
        )}
        style={{ ...(color ? { color } : {}) }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" height={24} />
        ) : (
          <>
            <div className="text-2xl">
              {new Intl.NumberFormat("vi-VN").format(value)}
            </div>
            {percentage ? (
              <div
                className={cn(
                  "text-sm flex gap-x-1 items-center",
                  percentage?.includes("-") ? "text-red-600" : "text-[#1B9E4B]"
                )}
              >
                {percentage?.includes("-") ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
                {`${new Intl.NumberFormat("vi-VN").format(
                  Number(percentage?.replace("-", "") || 0)
                )}%`}
                <span className="text-gray-500 text-xs">
                  (so với năm {previousYear})
                </span>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
