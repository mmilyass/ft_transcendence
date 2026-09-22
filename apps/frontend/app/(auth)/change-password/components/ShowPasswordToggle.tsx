interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ShowPasswordToggle({
  checked,
  onChange,
}: Props) {
  return (
    <div className="flex items-center">
      <input
        id="showPassword"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded"
        style={{
          accentColor: "#0057cd",
          borderColor: "#c2c6d8",
          backgroundColor: "#f3f3f7",
        }}
      />

      <label
        htmlFor="showPassword"
        className="ml-2 text-sm font-medium cursor-pointer select-none"
        style={{ color: "#424655" }}
      >
        Show password
      </label>
    </div>
  );
}