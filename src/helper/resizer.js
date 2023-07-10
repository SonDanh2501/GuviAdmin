import Resizer from "react-image-file-resizer";
const resizeFile = (file, extend) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      900,
      900,
      extend,
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

export default resizeFile;
