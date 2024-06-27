import React, { useState } from 'react';

const OpenFolderButton = ({ setImagePaths }: { setImagePaths: Function }) => {
  const handleOpenFolder = async () => {
    try {
      const imagePaths: string[] | null =
        await window.connectionAPIs.readLocalFolder();
      if (imagePaths !== null) {
        setImagePaths(imagePaths);
      } else {
        setImagePaths(null);
      }
    } catch (error) {
      console.error('读取文件夹中本地图像时出错:', error);
      setImagePaths(null);
    }
  };

  return (
    <div>
      <button onClick={handleOpenFolder}>打开图像文件夹</button>
    </div>
  );
};

export default OpenFolderButton;
