import { SideBarButton } from './SideBarButton';
import { ThemeSwitcher } from './ThemeSwitcher';

export default function SideBar() {
  return (
    <div className="app-sidebar-grid sidebar-container px-1 pt-4 pb-0.5">
      <div className="h-fit flex flex-col gap-2 sidebar-top-icons place-items-center place-content-center">
        <ThemeSwitcher></ThemeSwitcher>
      </div>
      <div className="h-fit flex flex-col-reverse gap-2 place-items-center place-content-center sidebar-bottom-icons">
        <SideBarButton icon="settings"></SideBarButton>
      </div>
    </div>
  );
}
