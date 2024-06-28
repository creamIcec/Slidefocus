/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { BrowserWindow, app, dialog, ipcMain, protocol, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import path from 'path';
import util from 'util';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import { ImageRawRecord } from '../renderer/App';
import { APP_PROTOCOL, FILE_PROTOCOL } from '../renderer/constants';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// 保存被点击图片对象
const clickedImages: ImageRawRecord[] = [];
const likedImages: ImageRawRecord[] = [];
//定义最近浏览的最大保存图片数量
const MAX_QUEUE_LENGTH = 10;
//保存图片路径的json文件
/*const clickedImagePathsFilePath = path.join(
  __dirname,
  'clicked-image-paths.json',
);*/
const clickedImagePathsFilePath = './clicked-images-paths.json';
const likedImagePathsFilePath = './liked-image-paths.json';

//
let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 450,
    icon: getAssetPath('icon.png'),
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const updateRecentLikedState = () => {
  const newClickedImages = clickedImages.map((item) => {
    if (likedImages.map((likedItem) => likedItem.path).includes(item.path)) {
      item.liked = true;
    } else {
      item.liked = false;
    }
    return item;
  });
  clickedImages.length = 0;
  clickedImages.push(...newClickedImages);

  const result = newClickedImages.map((item) => {
    return {
      path: decodeURIComponent(item.path),
      liked: item.liked,
      tags: item.tags,
      lastModified: item.lastModified,
    } as ImageRawRecord;
  });

  // 将更新后的数据写入JSON文件
  fs.writeFileSync(clickedImagePathsFilePath, JSON.stringify(result));
};

//建立所有的前后通信通道
const setUpChannels = () => {
  ipcMain.on('minimizeApp', () => {
    mainWindow?.minimize();
  });
  ipcMain.on('maximizeApp', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on('closeApp', () => {
    mainWindow?.close();
  });
  ipcMain.handle('read-local-image', async (event, filePath) => {
    try {
      const decodedFilePath = decodeURIComponent(filePath);

      const image: ImageRawRecord = {
        path: app.isPackaged
          ? FILE_PROTOCOL + decodedFilePath
          : APP_PROTOCOL + decodedFilePath,
        liked: false,
        tags: '',
        lastModified: '',
      };
      return image;
    } catch (error) {
      console.error('读取本地图片错误:', error);
      return null;
    }
  });
  ipcMain.handle('read-folder-images', async (event, filePaths: string[]) => {
    try {
      const imageRawRecords: ImageRawRecord[] = filePaths.map(
        (filePath: any) => {
          return {
            path: app.isPackaged
              ? (FILE_PROTOCOL + decodeURIComponent(filePath)).replaceAll(
                  '\\',
                  '/',
                )
              : APP_PROTOCOL + decodeURIComponent(filePath),
            liked: false,
            tags: '',
            lastModified: '',
          };
        },
      );
      return imageRawRecords;
    } catch (error) {
      console.error('读取本地图片错误:', error);
      return null;
    }
  });
  ipcMain.handle('show-open-dialog-Folder', async (event, options) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      ...options,
      properties: ['openDirectory'],
    });

    // 如果用户取消操作或没有选择文件，则返回空数组
    if (canceled) {
      return [];
    } else {
      // 否则返回选中的文件路径
      console.log(filePaths);

      const result: string[] = [];

      const readdir = util.promisify(fs.readdir);

      const files = await readdir(filePaths[0]);
      files.forEach((file) => {
        result.push(filePaths[0] + '\\' + file);
      });

      console.log('all files:' + result);
      return result;
    }
  });
  ipcMain.handle('show-open-dialog', async () => {
    // 打开文件选择框
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg', 'webp'] },
      ],
    });

    // 如果用户取消操作或没有选择文件，则返回空数组
    if (canceled) {
      return [];
    } else {
      // 否则返回选中的文件路径
      console.log(filePaths);

      return filePaths;
    }
  });

  ipcMain.handle('save-clicked-image', (event, image: ImageRawRecord) => {
    // 检查内存区中是否已经存在该图片信息
    const existingImageIndex = clickedImages.findIndex(
      (img) => img.path === image.path,
    );

    if (existingImageIndex !== -1) {
      // 如果图片信息已存在,且信息完全相同,则将其移动到最前面
      if (
        clickedImages[existingImageIndex].liked === image.liked &&
        clickedImages[existingImageIndex].tags === image.tags
      ) {
        clickedImages.splice(existingImageIndex, 1);
        clickedImages.unshift({
          path: image.path,
          liked: image.liked,
          tags: image.tags,
          lastModified: image.lastModified,
        });
      } else {
        // 如果图片信息已存在,但信息不同,则更新信息并将其移动到最前面
        clickedImages[existingImageIndex].liked = image.liked;
        clickedImages[existingImageIndex].tags = image.tags;
        clickedImages.unshift(clickedImages.splice(existingImageIndex, 1)[0]);
      }
    } else {
      // 如果图片信息不存在,则添加新的信息
      clickedImages.unshift({
        path: image.path,
        liked: image.liked,
        tags: image.tags,
        lastModified: image.lastModified,
      });

      // 如果超过最大上限,则删除最早的一条记录
      if (clickedImages.length > MAX_QUEUE_LENGTH) {
        clickedImages.pop();
      }
    }

    const result = clickedImages.map((item) => {
      return {
        path: decodeURIComponent(item.path),
        liked: item.liked,
        tags: item.tags,
        lastModified: item.lastModified,
      } as ImageRawRecord;
    });

    // 将更新后的数据写入JSON文件
    fs.writeFileSync(clickedImagePathsFilePath, JSON.stringify(result));

    console.log(
      `Saved clicked image path: ${image.path}, liked: ${image.liked}, tags: ${image.tags}`,
    );
    return clickedImages;
  });
  ipcMain.handle('save-liked-image', (event, imagePath, liked, tags) => {
    // 检查内存区中是否已经存在该图片信息
    const existingImageIndex = likedImages.findIndex(
      (img) => img.path === imagePath,
    );
    if (existingImageIndex !== -1) {
      // 如果图片信息已存在,且用户不喜欢该图片,则删除该图片信息
      if (!liked) {
        likedImages.splice(existingImageIndex, 1);
      }
    } else {
      // 如果图片信息不存在,则添加新的信息,将liked设置为true
      likedImages.unshift({
        path: imagePath,
        liked: true,
        tags,
        lastModified: '',
      });
    }

    const result = likedImages.map((item) => {
      return {
        path: decodeURIComponent(item.path),
        liked: item.liked,
        tags: item.tags,
        lastModified: item.lastModified,
      } as ImageRawRecord;
    });

    // 将更新后的数据写入JSON文件
    fs.writeFileSync(likedImagePathsFilePath, JSON.stringify(result));

    updateRecentLikedState();

    console.log(
      `Saved liked image path: ${imagePath}, liked: ${liked}, tags: ${tags}`,
    );
    console.log('新的喜欢:' + likedImages);
    return likedImages;
  });
  ipcMain.handle('get-recent-image-paths', async (event) => {
    const data = fs.readFileSync(clickedImagePathsFilePath, {
      encoding: 'utf-8',
    });
    return JSON.parse(data.toString());
  });
  ipcMain.handle('get-liked-image-paths', async (event) => {
    const likeddata = fs.readFileSync(likedImagePathsFilePath, {
      encoding: 'utf-8',
    });
    return JSON.parse(likeddata.toString());
  });
  ipcMain.handle('get-app-packaged', async (event) => {
    return app.isPackaged;
  });
};

const escape = (uriStr: string) => {
  return uriStr.replace(/%/g, '%25');
};

const setUpProtocol = () => {
  // Name the protocol whatever you want.
  const protocolName = 'app';

  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, '');
    try {
      return callback(decodeURIComponent(decodeURIComponent(escape(url))));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });
};

//所有需要在应用启动的时候建立的事件监听
const onStart = () => {
  fs.access(clickedImagePathsFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      const emptyJson = JSON.stringify([]);
      fs.writeFileSync(clickedImagePathsFilePath, emptyJson);
    } else {
      const data = fs.readFileSync(clickedImagePathsFilePath, {
        encoding: 'utf-8',
      });
      if (!data) {
        return;
      }
      const clickedImageObjects = JSON.parse(data.toString());
      for (let item of clickedImageObjects) {
        clickedImages.push(item);
      }
    }
  });

  fs.access(likedImagePathsFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      const emptyJson = JSON.stringify([]);
      fs.writeFileSync(likedImagePathsFilePath, emptyJson);
    } else {
      const data = fs.readFileSync(likedImagePathsFilePath, {
        encoding: 'utf-8',
      });
      if (!data) {
        return;
      }
      const likedImageObjects = JSON.parse(data.toString());
      for (let item of likedImageObjects) {
        likedImages.push(item);
      }
    }
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    onStart();

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    setUpChannels();
    setUpProtocol();
  })
  .catch(console.log);
