import { ReactNode } from 'react';

const SideBarButton = ({ icon }: { icon: string }) => {
  return <i className="material-symbols-outlined text-3xl">{icon}</i>;
};

export { SideBarButton };
