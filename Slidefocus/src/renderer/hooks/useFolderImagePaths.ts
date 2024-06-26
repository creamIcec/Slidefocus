import { useEffect, useState } from 'react';

type AccessMethod = {
  method: 'get' | 'set';
  data: string[];
};

function useFolderImagePaths(method: AccessMethod) {
  const [folderImagePaths, setFolderImagePaths] = useState<string[]>([]);

  useEffect(() => {
    if (method.method == 'set') {
      setFolderImagePaths(method.data);
    }
  }, []);

  if (method.method == 'get') {
    return folderImagePaths;
  }

  return null;
}

export { useFolderImagePaths };
