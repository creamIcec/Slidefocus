import { useEffect, useState } from 'react';

function useLikedImages() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [recentImagePaths, setRecentImagePaths] = useState<string[]>([]);

  useEffect(() => {
    async function fetchRecent() {
      const recentImages = await window.connectionAPIs.readRecentImages();
      setRecentImagePaths(recentImages.map((item: any) => item.path));
    }
    fetchRecent();
    return () => {};
  }, [refresh]);

  console.log('new recent:' + recentImagePaths);
  return { recentImagePaths, refresh, setRefresh };
}

export { useLikedImages };
