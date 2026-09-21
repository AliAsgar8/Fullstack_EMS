import PayslipPrintView from "@/components/ui/PayslipPrintView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PrintPayslipPage({ params }: Props) {
  const { id } = await params;

  return (
    <PayslipPrintView
      payslipId={id}
      backHref="/admin/payslip"
    />
  );
}
