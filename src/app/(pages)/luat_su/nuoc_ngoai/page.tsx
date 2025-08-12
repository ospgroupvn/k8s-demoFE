import { QUERY_KEY } from "@/constants/common";
import { getAllOrg } from "@/service/lawyer";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import LawyerForeignList from "./list";
import { getListNation } from "@/service/common";

const ForeignLawyerListPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_TO_CHUC],
    queryFn: () => getAllOrg("server"),
  });

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.NATION],
    queryFn: () => getListNation("server"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LawyerForeignList />
    </HydrationBoundary>
  );
};

export default ForeignLawyerListPage;
