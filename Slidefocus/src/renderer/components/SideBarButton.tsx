import { ReactNode } from 'react';

const SideBarButton = ({ icon }: { icon: string }) => {
  return (
    <button className="cursor-pointer hover:bg-bg rounded-xl p-1">
      <i className="material-symbols-outlined text-3xl">{icon}</i>
    </button>
  );
};

export { SideBarButton };
