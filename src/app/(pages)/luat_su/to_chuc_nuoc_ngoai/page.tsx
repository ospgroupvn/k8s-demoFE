import { QUERY_KEY } from "@/constants/common";
import { getListProvinceNew } from "@/service/common";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import LawyerOrgForeignList from "./list";

const ForeignLawyerListPage = async () => {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew("server"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LawyerOrgForeignList />
    </HydrationBoundary>
  );
};

export default ForeignLawyerListPage;
