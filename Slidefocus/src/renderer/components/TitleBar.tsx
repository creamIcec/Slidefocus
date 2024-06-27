import TitleBarButton from './TitleBarButton';

export default function TitleBar({
  onSearchCallback,
}: {
  onSearchCallback: Function;
}) {
  return (
    <div className="app-titlebar-grid bg-primary dark:bg-primary_dark  app-titlebar shadow-md">
      <div className="h-full flex flex-row gap-2 place-items-center p-5">
        <div className="font-normal text-2xl font-hanserifr text-black dark:text-white">
          SlideFocus
        </div>
        <div className="mx-10 relative bg-bg dark:bg-bg_dark p-2 rounded-2xl">
          <i className="material-symbols-outlined absolute left-0 px-2 py-1 text-black dark:text-white">
            search
          </i>
          <input
            onKeyUp={(e) => {
              if (e.key == 'Enter') {
                console.log('enter');
                onSearchCallback((e.target as HTMLInputElement).value);
              }
            }}
            placeholder="搜索图片名称..."
            className="w-96 h-8 p-2 font-normal mx-10 text-base rounded-2xl no-drag bg-bg dark:bg-bg_dark outline-none text-black dark:text-white"
          />
        </div>
      </div>
      <div className="grid gap-2 grid-cols-3 grid-rows-1 w-32 fixed right-0 top-0 p-5 no-drag">
        <TitleBarButton message="minimizeApp">
          <i className="text-2xl material-symbols-outlined text-black dark:text-white">
            remove
          </i>
        </TitleBarButton>
        <TitleBarButton message="maximizeApp">
          <i className="text-2xl material-symbols-outlined text-black dark:text-white">
            crop_square
          </i>
        </TitleBarButton>
        <TitleBarButton message="closeApp">
          <i className="text-2xl material-symbols-outlined text-black dark:text-white">
            close
          </i>
        </TitleBarButton>
      </div>
    </div>
  );
}
