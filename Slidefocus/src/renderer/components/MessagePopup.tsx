export default function MessagePopup({
  message,
  showing,
}: {
  message: string;
  showing: boolean;
}) {
  return (
    <div
      className={`w-full z-[1001] transition-all bottom-8  fixed  h-16 flex flex-col flex-nowrap place-content-center place-items-center`}
    >
      <div className="w-48 h-full bg-bg dark:bg-bg_dark/60 rounded-2xl flex flex-col flex-nowrap place-content-center place-items-center">
        <span className="w-full text-center text-base font-bold text-black dark:text-white">
          {message}
        </span>
      </div>
    </div>
  );
}
