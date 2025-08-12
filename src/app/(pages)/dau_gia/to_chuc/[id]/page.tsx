import UpsertAuctionOrgForm from "@/components/dau_gia/to_chuc/upsertForm";

const EditAuctionOrg = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <UpsertAuctionOrgForm id={id} />;
};

export default EditAuctionOrg;
