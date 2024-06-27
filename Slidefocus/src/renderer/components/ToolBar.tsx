export default function ToolBar({
  setSortMethod,
}: {
  setSortMethod: Function;
}) {
  return (
    <div className="toolbar-container w-[92%] h-16 m-5 bg-bgc/60 dark:bg-bgc_dark/60 rounded-3xl backdrop-blur-sm">
      <div className="flex flex-row gap-4">
        <span className="font-hanserifb text-xl px-5 text-black dark:text-white">
          排序方式
        </span>
        <button
          onClick={() => {
            setSortMethod('path');
          }}
        >
          <i className="text-2xl material-symbols-outlined text-black dark:text-white">
            sort_by_alpha
          </i>
        </button>
        <button
          onClick={() => {
            setSortMethod('last-modified');
          }}
        >
          <i className="text-2xl material-symbols-outlined text-black dark:text-white">
            schedule
          </i>
        </button>
      </div>
    </div>
  );
}
