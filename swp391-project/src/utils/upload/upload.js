import storage from "../../config/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const uploadFile = async (file) => {
  console.log(file);
  const storageRef = ref(storage, file.name);
  const response = await uploadBytes(storageRef, file);
  const dowloadURL = await getDownloadURL(response.ref);
  return dowloadURL;
};

export default uploadFile;
