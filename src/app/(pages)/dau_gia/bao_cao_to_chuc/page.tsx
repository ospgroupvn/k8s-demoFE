import { QUERY_KEY } from "@/constants/common";
import { reportAuctionOrg } from "@/service/auctionOrg";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryFunctionContext,
} from "@tanstack/react-query";
import ReportOrgList from "./list";
import { CommonReportParams } from "@/types/common";

const AuctionOrgReport = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      QUERY_KEY.DAU_GIA.BAO_CAO_TO_CHUC,
      { numberPerPage: 100, pageNumber: 1, aTypes: ["2", "3", "4", "5", "6"] },
    ],
    queryFn: (queryKey: QueryFunctionContext<[string, CommonReportParams]>) =>
      reportAuctionOrg(queryKey, "server"),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReportOrgList />
    </HydrationBoundary>
  );
};

export default AuctionOrgReport;
