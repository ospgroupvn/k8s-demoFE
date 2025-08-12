import UpsertAuctioneerForm from "@/components/dau_gia/dau_gia_vien/upsertForm";

const AuctioneerDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <UpsertAuctioneerForm id={id} />;
};

export default AuctioneerDetail;
