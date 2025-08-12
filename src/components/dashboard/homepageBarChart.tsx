"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

export const HomepageBarChart = () => {
  const chartConfig = {
    ccv: {
      label: "Công chứng viên",
      color: "#057CCE",
    },
    ls: {
      label: "Luật sư",
      color: "#62C59A",
    },
    dgv: {
      label: "Đấu giá viên",
      color: "#F97316",
    },
  } satisfies ChartConfig;

  const chartData = [
    { province: "Hà Nội", ccv: 7100, ls: 3200, dgv: 400 },
    { province: "Huế", ccv: 240, ls: 100, dgv: 32 },
    { province: "Lai Châu", ccv: 80, ls: 30, dgv: 8 },
    { province: "Điện Biên", ccv: 90, ls: 35, dgv: 10 },
    { province: "Sơn La", ccv: 120, ls: 45, dgv: 12 },
    { province: "Lạng Sơn", ccv: 110, ls: 40, dgv: 11 },
    { province: "Quảng Ninh", ccv: 220, ls: 85, dgv: 26 },
    { province: "Thanh Hóa", ccv: 380, ls: 160, dgv: 35 },
    { province: "Nghệ An", ccv: 450, ls: 180, dgv: 40 },
    { province: "Hà Tĩnh", ccv: 200, ls: 75, dgv: 20 },
    { province: "Cao Bằng", ccv: 85, ls: 32, dgv: 9 },
    { province: "Tuyên Quang", ccv: 95, ls: 38, dgv: 10 },
    { province: "Lào Cai", ccv: 130, ls: 50, dgv: 14 },
    { province: "Thái Nguyên", ccv: 180, ls: 70, dgv: 18 },
    { province: "Phú Thọ", ccv: 160, ls: 60, dgv: 16 },
    { province: "Bắc Ninh", ccv: 140, ls: 55, dgv: 15 },
    { province: "Hưng Yên", ccv: 125, ls: 48, dgv: 13 },
    { province: "Ninh Bình", ccv: 115, ls: 42, dgv: 12 },
    { province: "Quảng Trị", ccv: 105, ls: 40, dgv: 11 },
    { province: "Quảng Ngãi", ccv: 170, ls: 65, dgv: 17 },
    { province: "Gia Lai", ccv: 150, ls: 58, dgv: 15 },
    { province: "Khánh Hòa", ccv: 320, ls: 140, dgv: 45 },
    { province: "Lâm Đồng", ccv: 190, ls: 75, dgv: 22 },
    { province: "Đắk Lắk", ccv: 210, ls: 80, dgv: 24 },
    { province: "Hồ Chí Minh", ccv: 6500, ls: 2900, dgv: 300 },
    { province: "Đồng Nai", ccv: 250, ls: 95, dgv: 28 },
    { province: "Tây Ninh", ccv: 160, ls: 65, dgv: 18 },
    { province: "Cần Thơ", ccv: 350, ls: 120, dgv: 50 },
    { province: "Vĩnh Long", ccv: 140, ls: 52, dgv: 14 },
    { province: "Đồng Tháp", ccv: 180, ls: 70, dgv: 20 },
    { province: "Cà Mau", ccv: 120, ls: 45, dgv: 12 },
    { province: "An Giang", ccv: 200, ls: 78, dgv: 22 },
    { province: "Hải Phòng", ccv: 400, ls: 150, dgv: 60 },
    { province: "Đà Nẵng", ccv: 900, ls: 400, dgv: 120 },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="!grid-rows-1 items-center">
        <CardTitle>Phân bố chức danh theo Tỉnh/Thành</CardTitle>
        <CardAction>
          <Select defaultValue="all">
            <SelectTrigger className="min-w-50">
              <SelectValue placeholder="Chọn Tỉnh/Thành" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toàn quốc</SelectItem>
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="hochiminh">Hồ Chí Minh</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
              <SelectItem value="cantho">Cần Thơ</SelectItem>
              <SelectItem value="haiphong">Hải Phòng</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="relative">
        {/* Fixed Legend */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: chartConfig.ccv.color }}
              ></div>
              <span className="text-sm">{chartConfig.ccv.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: chartConfig.ls.color }}
              ></div>
              <span className="text-sm">{chartConfig.ls.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: chartConfig.dgv.color }}
              ></div>
              <span className="text-sm">{chartConfig.dgv.label}</span>
            </div>
          </div>
        </div>

        {/* Chart with Y-axis (sticky) and scrollable bars */}
        <div className="flex">
          {/* Fixed Y-axis */}
          <div className="w-16 flex-shrink-0">
            <div className="h-[320px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart
                  data={[{ province: "", ccv: 8000, ls: 3500, dgv: 450 }]}
                  margin={{ bottom: 0, left: 0, right: 0, top: 20 }}
                >
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v.toLocaleString()}
                    width={60}
                  />
                  <Bar dataKey="ccv" fill="transparent" />
                </BarChart>
              </ChartContainer>
            </div>
            {/* Empty space for X-axis alignment */}
            <div className="h-[60px]"></div>
          </div>

          {/* Scrollable chart area with both bars and labels */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div style={{ minWidth: `${chartData.length * 80}px` }}>
              {/* Chart bars */}
              <div className="h-[320px]">
                <ChartContainer
                  config={chartConfig}
                  className="h-full w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    margin={{ bottom: 0, left: 0, right: 20, top: 20 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis 
                      dataKey="province" 
                      hide 
                    />
                    <YAxis hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="ccv" fill={chartConfig.ccv.color} radius={4} />
                    <Bar dataKey="ls" fill={chartConfig.ls.color} radius={4} />
                    <Bar dataKey="dgv" fill={chartConfig.dgv.color} radius={4} />
                  </BarChart>
                </ChartContainer>
              </div>

              {/* X-axis labels */}
              <div className="flex h-[60px]">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="text-center flex items-center justify-center"
                    style={{
                      transform: "rotate(-45deg)",
                      transformOrigin: "center center",
                      fontSize: "12px",
                      width: "80px",
                      minWidth: "80px",
                    }}
                  >
                    {item.province}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
