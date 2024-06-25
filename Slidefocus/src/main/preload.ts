// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'minimizeApp'
  | 'maximizeApp'
  | 'closeApp';

const ConnectionHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  //读取本地的图片
  readLocalImage: async () => {
    try {
      const filePaths = await ipcRenderer.invoke('show-open-dialog', {
        properties: ['openFile'],
        filters: [
          { name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg','webp'] },
        ],
      });
  
      if (filePaths.length > 0) {
        console.log(filePaths);
        return filePaths[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('读取错误:', error);
      return null;
    }
  },
  //最近看过的图片
  readRecentImages: async () => {
    try {
      const recentImagePaths = await ipcRenderer.invoke('get-recent-image-paths');
      const recentImages = await Promise.all(recentImagePaths.map(ConnectionHandler.readLocalImage));
      return recentImages;
    } catch (error) {
      console.error('读取最近看过的图片时发生错误:', error);
      return [];
    }
  },
  //读取文件夹中的图片
  readLocalFolder: async () => {
    try {
      const folderPaths = await ipcRenderer.invoke('show-open-dialog-Folder', {});
      
      if (folderPaths.length > 0) {
        const imagePaths = await ipcRenderer.invoke('read-folder-images', folderPaths);
        return imagePaths;
      } else {
        return [];
      }
    } catch (error) {
      console.error('读取错误:', error);
      return null;
    }
  },
  
  //读取收藏夹中的图片
  readFavoriteImages: async () => {
    try {
      const favoritedImagePaths = await ipcRenderer.invoke('get-favorited-image-paths');
      const favoriteImages = await Promise.all(favoritedImagePaths.map(ConnectionHandler.readLocalImage));
      return favoriteImages;
    } catch (error) {
      console.error('读取收藏夹中的照片时发生错误:', error);
      return [];
    }
  },
};

contextBridge.exposeInMainWorld('connectionAPIs', ConnectionHandler);

export type ElectronHandler = typeof ConnectionHandler;
