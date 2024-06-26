import { useState } from 'react';
import ExpandButton from './ExpandButton';

export default function ExpandPanelTitle({
  expandFunction,
  title,
}: {
  expandFunction: Function;
  title: string;
}) {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <div
      onClick={() => {
        expandFunction();
        setExpand(!expand);
      }}
      className="transition duration-200 hover:bg-bgc dark:hover:bg-bgc_dark flex flex-nowrap flex-row place-content-start place-items-center p-5 rounded-lg"
    >
      <ExpandButton expanded={expand}></ExpandButton>
      <span className="text-xl text-black dark:text-white font-hanserifb">
        {title}
      </span>
    </div>
  );
}
