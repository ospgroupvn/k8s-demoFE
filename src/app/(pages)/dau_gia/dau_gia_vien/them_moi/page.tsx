import UpsertAuctioneerForm from "@/components/dau_gia/dau_gia_vien/upsertForm";
import { QUERY_KEY } from "@/constants/common";
import { getListPlaceOfIssue, getListProvinceNew } from "@/service/common";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

const AddDGV = async () => {
  const queryClient = new QueryClient();

  redirect("/dau_gia/dau_gia_vien");

  const provinceQuery = queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    staleTime: 1000 * 60 * 5,
  });

  const poiQuery = queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.PLACE_OF_ISSUE],
    queryFn: () => getListPlaceOfIssue(),
  });

  await Promise.allSettled([provinceQuery, poiQuery]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UpsertAuctioneerForm />
    </HydrationBoundary>
  );
};

export default AddDGV;
