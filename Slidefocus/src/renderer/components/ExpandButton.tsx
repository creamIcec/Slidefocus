export default function ExpandButton({
  expandFunction,
}: {
  expandFunction: Function;
}) {
  const switchExpand = () => {
    expandFunction();
  };

  return (
    <button onClick={() => switchExpand()}>
      <i className="material-symbols-outlined text-3xl text-black dark:text-white">
        arrow_right
      </i>
    </button>
  );
}
