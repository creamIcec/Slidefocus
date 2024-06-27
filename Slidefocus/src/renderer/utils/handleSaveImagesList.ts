import { ImageRawRecord } from '../App';

const handleImageClickForRecent = async (imageRawRecord: ImageRawRecord) => {
  const updatedClickedImagePaths =
    await window.connectionAPIs.saveRecentImages(imageRawRecord);
  //window.connectionAPIs.setState({ clickedImagePaths: updatedClickedImagePaths });
};
const handleLikedImageClick = async (imagePath: any, liked: any, tags: any) => {
  /*const updatedClickedImagePaths = await window.connectionAPIs.saveRecentImages(
    imagePath,
    liked,
    tags,
  );*/
  //window.connectionAPIs.setState({ clickedImagePaths: updatedClickedImagePaths });
};

export { handleImageClickForRecent };
