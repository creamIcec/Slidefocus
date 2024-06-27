import { useEffect, useState } from 'react';

function useRencentImages() {
  const [recentImagePaths, setRecentImagePaths] = useState<string[]>([]);

  useEffect(() => {
    async function fetchRecent() {
      const recentImages = await window.connectionAPIs.readRecentImages();
      setRecentImagePaths(recentImages.map((item: any) => item.path));
    }
    fetchRecent();
    return () => {};
  }, []);

  console.log('new recent:' + recentImagePaths);
  return { recentImagePaths };
}

export { useRencentImages as useRencentFiles };
