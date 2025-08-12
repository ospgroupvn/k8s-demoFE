import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import LayoutClient from "./layoutClient";
import { QUERY_KEY } from "@/constants/common";
import { getAllOrganization } from "@/service/auctionOrg";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY.DAU_GIA.SO_TU_PHAP, "deprecated"],
    queryFn: () => getAllOrganization("server"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LayoutClient>{children}</LayoutClient>
    </HydrationBoundary>
  );
};

export default Layout;
