import UpsertNotaryOrgForm from "@/components/cong_chung/to_chuc/upsertForm";

const DetailNotaryOrg = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <UpsertNotaryOrgForm id={parseInt(id)} />;
};

export default DetailNotaryOrg;
