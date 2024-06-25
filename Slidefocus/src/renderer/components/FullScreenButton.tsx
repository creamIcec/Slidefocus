export default function FullScreenButton({
  icon,
  onClickFunction,
}: {
  icon: string;
  onClickFunction: Function | null;
}) {
  return (
    <button className="cursor-pointer hover:bg-bg rounded-xl p-1">
      <i
        className="material-symbols-outlined text-3x"
        onClick={() => (onClickFunction ? onClickFunction() : null)}
      >
        {icon}
      </i>
    </button>
  );
}
