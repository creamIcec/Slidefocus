import { ReactNode } from 'react';

type TitlebarButtonProps = {
  message: 'minimizeApp' | 'maximizeApp' | 'closeApp';
  children: ReactNode;
};

const TitlebarButton = ({ message, children }: TitlebarButtonProps) => (
  <button
    onClick={() => {
      window.connectionAPIs.ipcRenderer.sendMessage(message, [message]);
    }}
  >
    {/* children would be one of your icons */}
    {children}
  </button>
);

export default TitlebarButton;
