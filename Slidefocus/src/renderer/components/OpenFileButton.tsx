import React, { useState } from 'react';

const OpenFileButton = ({setPath} : {setPath: Function}) => {
  const handleOpenFile = async () => {
    try {
      const imagePath = await window.connectionAPIs.readLocalImage();
      setPath("app://" + imagePath)
    } catch (error) {
      console.error('读取本地图像时出错:', error);
    }
  };

  return (
    <div>
      <button onClick={handleOpenFile}>打开图像</button>
    </div>
  );
};

export default OpenFileButton;