import UpsertAuctionOrgForm from "@/components/dau_gia/to_chuc/upsertForm";
import { QUERY_KEY } from "@/constants/common";
import { getListProvinceNew } from "@/service/common";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

const AddAuctionOrg = async () => {
  const queryClient = new QueryClient();

  redirect("/dau_gia/to_chuc");

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UpsertAuctionOrgForm />
    </HydrationBoundary>
  );
};

export default AddAuctionOrg;
