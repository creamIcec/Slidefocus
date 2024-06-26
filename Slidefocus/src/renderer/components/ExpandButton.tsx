export default function ExpandButton({ expanded }: { expanded: boolean }) {
  return (
    <button>
      <i className="material-symbols-outlined text-3xl text-black dark:text-white">
        {expanded ? 'arrow_drop_down' : 'arrow_right'}
      </i>
    </button>
  );
}
