import { QUERY_KEY } from "@/constants/common";
import { getAllAssoc, getAllOrg } from "@/service/lawyer";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import LawyerDomesticList from "./list";

const DomesticLawyerListPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_DOAN_LS],
    queryFn: () => getAllAssoc("server"),
  });

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.LUAT_SU.DS_TO_CHUC],
    queryFn: () => getAllOrg("server"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LawyerDomesticList />
    </HydrationBoundary>
  );
};

export default DomesticLawyerListPage;
