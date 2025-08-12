import { QUERY_KEY } from "@/constants/common";
import { formatUserLocalTime } from "@/lib/utils";
import { searcHistorySystemListData } from "@/service/admin";
import { HistorySystemListItem, HistorySystemParams } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import CommonTable from "../common/commonTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface HomeActivityItem {
  subject: string;
  action: string;
  user: string;
  date: string;
}

export const HomepageActivity = () => {
  const params: HistorySystemParams = {
    pageNumber: 1,
    numberPerPage: 5,
  };

  const query = useQuery({
    queryKey: [QUERY_KEY.ADMIN.HISTORY_SYSTEM, params],
    queryFn: searcHistorySystemListData,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const data: HomeActivityItem[] = useMemo(() => {
    const items = query.data?.data || [];
    return items.map((item: HistorySystemListItem) => ({
      subject: item.objectName,
      action: item.actions,
      user: item.createByStr,
      date: formatUserLocalTime(item.genDate || 0),
    }));
  }, [query.data]);

  const columns: ColumnDef<HomeActivityItem>[] = [
    {
      accessorKey: "subject",
      header: () => <div className="text-left">Đối tượng</div>,
      cell: ({ row }) => (
        <div className="text-left py-2">{row.original.subject}</div>
      ),
    },
    {
      accessorKey: "action",
      header: () => <div className="text-left">Hành động</div>,
      cell: ({ row }) => <div className="text-left">{row.original.action}</div>,
    },
    {
      accessorKey: "user",
      header: () => <div className="text-left">Người thực hiện</div>,
      cell: ({ row }) => <div className="text-left">{row.original.user}</div>,
    },
    {
      accessorKey: "date",
      header: () => <div className="text-left">Thời gian</div>,
      cell: ({ row }) => <div className="text-left">{row.original.date}</div>,
    },
    // Detail column omitted for compact homepage view
  ];

  const table = useReactTable({
    manualPagination: false,
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <CommonTable
          data={{
            items: data,
            numberPerPage: 5,
            pageList: [1],
            pageCount: 1,
          }}
          table={table}
          isLoading={query.isFetching}
          showIndex={false}
          showTitleHeader={false}
          // Hide pagination controls externally by providing single page meta
        />
      </CardContent>
    </Card>
  );
};
