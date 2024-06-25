export default function ToolBar() {
  return (
    <div className="toolbar-container w-[92%] h-16 m-5 bg-bgc/60 rounded-3xl backdrop-blur-sm">
      <div className="flex flex-row gap-4">
        <span className="font-hanserifb text-xl px-5">排序方式</span>
        <i className="text-2xl material-symbols-outlined">sort_by_alpha</i>
        <i className="text-2xl material-symbols-outlined">schedule</i>
      </div>
      <div className="flex flex-row gap-4 mx-4 place-items-center place-content-center">
        <input type="checkbox" className="w-4 h-4 outline-none inline"></input>
        <span className="font-hanserifb text-xl">优先喜欢的图片</span>
      </div>
    </div>
  );
}
