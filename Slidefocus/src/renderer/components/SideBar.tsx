import { SideBarButton } from './SideBarButton';

export default function SideBar() {
  return (
    <div className="app-sidebar-grid sidebar-container px-1 pt-1 pb-0.5">
      <div className="h-fit flex flex-col gap-2 sidebar-top-icons place-items-center place-content-center">
        <SideBarButton icon="more_horiz"></SideBarButton>
        <SideBarButton icon="dark_mode"></SideBarButton>
        <SideBarButton icon="star"></SideBarButton>
      </div>
      <div className="h-fit flex flex-col-reverse gap-2 place-items-center place-content-center sidebar-bottom-icons">
        <SideBarButton icon="settings"></SideBarButton>
      </div>
    </div>
  );
}
