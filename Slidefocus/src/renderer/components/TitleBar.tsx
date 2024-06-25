import TitleBarButton from './TitleBarButton';

export default function TitleBar() {
  return (
    <div className="app-titlebar-grid bg-primary app-titlebar">
      <div className="h-full flex flex-row gap-2 place-items-center p-5">
        <div className="font-normal text-2xl font-hanserifr">SlideFocus</div>
        <div className="mx-10 relative bg-bg p-2 rounded-2xl">
          <i className="material-symbols-outlined absolute left-0 px-2 py-1">
            search
          </i>
          <input
            placeholder="搜索图片名称..."
            className="w-96 h-8 p-2 font-normal mx-10 text-base rounded-2xl no-drag bg-bg outline-none"
          />
        </div>
      </div>
      <div className="grid gap-2 grid-cols-3 grid-rows-1 w-32 fixed right-0 top-0 p-5 no-drag">
        <TitleBarButton message="minimizeApp">
          <i className="text-2xl material-symbols-outlined">remove</i>
        </TitleBarButton>
        <TitleBarButton message="maximizeApp">
          <i className="text-2xl material-symbols-outlined">crop_square</i>
        </TitleBarButton>
        <TitleBarButton message="closeApp">
          <i className="text-2xl material-symbols-outlined">close</i>
        </TitleBarButton>
      </div>
    </div>
  );
}
