const handleImageClickForRecent = async (
  imagePath: any,
  liked: any,
  tags: any,
) => {
  const updatedClickedImagePaths = await window.connectionAPIs.saveRecentImages(
    imagePath,
    liked,
    tags,
  );
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
