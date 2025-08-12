import { QUERY_KEY } from "@/constants/common";
import { getListProvinceNew } from "@/service/common";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import UserList from "./list";

const UserPage = () => {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.COMMON.PROVINCE],
    queryFn: () => getListProvinceNew("server"),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserList />
    </HydrationBoundary>
  );
};

export default UserPage;
