const sortImages = (srcArray: string[]) => {
  srcArray.sort((item1, item2) => {
    return item1.localeCompare(item2, 'zh-CN');
  });
};

export { sortImages };
