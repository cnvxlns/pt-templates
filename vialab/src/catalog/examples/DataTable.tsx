import { DataTable } from "@/components";

export default function Example() {
  return (
    <DataTable
      columns={[
        "방법",
        { header: "정확도", align: "right", num: true },
        { header: "지연", align: "right", num: true },
      ]}
      rows={[
        ["Baseline A", "89.3", "24ms"],
        ["Baseline B", "90.1", "21ms"],
        ["Ours", "92.4", "18ms"],
      ]}
      highlight={[2]}
    />
  );
}
