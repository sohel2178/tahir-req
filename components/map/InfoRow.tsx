export default function InfoRow({
  label,
  value,
  success,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      <span
        className={
          success ? "text-green-600 font-semibold" : "text-gray-900 font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
