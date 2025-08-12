import UpsertNotaryOrgForm from "@/components/cong_chung/to_chuc/upsertForm";
import { QUERY_KEY } from "@/constants/common";
import { getListProvinceNew } from "@/service/common";
import { getListNotaryAdministration } from "@/service/notaryOrg";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const AddNotaryOrg = async () => {
  const queryClient = new QueryClient();

  const provinceQuery = queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew(),
    staleTime: 1000 * 60 * 5,
  });

  const departmentQuery = queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.DEPARTMENT, "notary"],
    queryFn: () => getListNotaryAdministration(2),
  });

  await Promise.allSettled([provinceQuery, departmentQuery]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UpsertNotaryOrgForm />
    </HydrationBoundary>
  );
};

export default AddNotaryOrg;
