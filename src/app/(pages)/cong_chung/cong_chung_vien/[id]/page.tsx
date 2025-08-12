import UpsertNotaryForm from "@/components/cong_chung/cong_chung_vien/upsertForm";

const NotaryDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <UpsertNotaryForm id={parseInt(id)} />;
};

export default NotaryDetail;
