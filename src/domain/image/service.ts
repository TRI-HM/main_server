
const getOne = async (uuid: string) => {

  // Simulate fetching an image by UUID
  const images = [
    { uuid: "123", data: "Image data for 123" },
    { uuid: "456", data: "Image data for 456" },
  ];

  const image = images.find((img) => img.uuid === uuid);
  return image ? image.data : null;
}


const imageService = {
  getOne,
};

export default imageService;