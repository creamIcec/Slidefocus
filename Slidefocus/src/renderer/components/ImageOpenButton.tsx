export default function ImageOpenButton() {
  return (
    <div className="w-full fixed bottom-4 flex flex-row flex-nowrap place-content-center place-items-center pointer-events-none">
      <div className=" bg-bg/60 dark:bg-bg_dark/60 rounded-3xl backdrop-blur-sm">
        <div className="w-64 h-16 p-4 flex flex-row flex-nowrap gap-2 place-content-evenly">
          <button className="w-36 h-8 p-1 font-hanserifr dark:text-black text-white bg-bg_dark dark:bg-bg rounded-2xl pointer-events-auto">
            打开文件...
          </button>
          <button className="w-36 h-8 p-1 font-hanserifr text-black dark:text-white bg-secondary dark:bg-secondary_dark rounded-2xl pointer-events-auto">
            打开文件夹...
          </button>
        </div>
      </div>
    </div>
  );
}
