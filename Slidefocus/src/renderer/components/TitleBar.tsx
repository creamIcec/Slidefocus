export default function TitleBar() {
  return (
    <div>
      <div className="flex flex-row gap-16 fixed top-0 left-0 right-0 p-5">
        <div className="font-normal text-2xl">SlideFocus</div>
        <div>
          <i className="material-symbols-outlined">search</i>
          <input className="w-96 h-8 font-normal text-base rounded-xl" />
        </div>
      </div>
      <div className="grid gap-2 grid-cols-3 grid-rows-1 w-32 fixed right-0 top-0 p-5">
        <i className="material-symbols-outlined">remove</i>
        <i className="material-symbols-outlined">crop_square</i>
        <i className="material-symbols-outlined">close</i>
      </div>
    </div>
  );
}
