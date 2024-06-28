
const SideBarButton = ({ icon }: { icon: string }) => {
  return (
    <button className="cursor-pointer hover:bg-bg dark:hover:bg-bg_dark rounded-xl p-1">
      <i className="material-symbols-outlined text-3xl text-black dark:text-white">
        {icon}
      </i>
    </button>
  );
};

export { SideBarButton };
