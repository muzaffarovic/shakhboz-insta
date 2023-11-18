import Input from "components/input/Input";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai"

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import ImageUpload from "components/image/ImageUpload";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import { useAuth } from "contexts/auth-context";

const AddNewPost = () => {
  const { userInfo } = useAuth();
  const [image, setImage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { control, handleSubmit, setValue, getValues } = useForm({
    mode: "onChange",
  });
  const formRef = useRef(null);
  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (
        showForm &&
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [showForm]);
  const handleButtonClick = () => {
    setShowForm(true);
  };

  const onSeletecImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image_name", file.name);
    handleUploadImage(file);
  };
  const [progress, setProgress] = useState(0);
  const handleUploadImage = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Notthing");
        }
      },
      (error) => {
        console.log("error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
        });
      }
    );
  };
  const handleDeleteImage = (file) => {
    const storage = getStorage();
    const imageRef = ref(storage, "images/" + getValues("image_name"));
    deleteObject(imageRef)
      .then(() => {
        console.log("Xóa thành công");
        setImage("");
        setProgress(0);
      })
      .catch((error) => {
        console.log("ko thanh cong");
      });
  };

  const [user, setUser] = useState({});
  useEffect(() => {
    async function fetchUser() {
      if (userInfo && userInfo.uid) {
        const docRef = doc(db, "users", userInfo.uid);
        const docSnap = await getDoc(docRef);
        setUser(docSnap.data());
      }
    }
    fetchUser();
  }, [userInfo]);

  const handleAddPost = async (values) => {
    const cloneValues = { ...values };
    const colRef = collection(db, "posts");
    await addDoc(colRef, {
      ...cloneValues,
      image,
      userId: userInfo.uid,
      PostNameId: user.username,
      createAt: serverTimestamp(),
      username: user.username,
      likePost: 0,
      commentPost: 0,
    });
    window.location.reload();
  };
  return (
    <div>
      <div
        onClick={handleButtonClick}
        className="sidebar-icon flex items-center px-5 mt-2 rounded-lg ss:px-5 sm:py-1 sm:my-3 hover:cursor-pointer lg:pr-20 hover:bg-slate-200"
      >
        <i className="text-3xl bx bx-message-alt-add"><AiOutlinePlusCircle/></i>
        <p className="hidden ml-3 text-base lg:block">Create</p>
      </div>
      {showForm && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.5)] z-99">
          <form
            className="w-full h-auto px-5 py-5 mx-2 bg-white sm:w-1/2 lg:w-4/12 rounded-2xl"
            ref={formRef}
            onSubmit={handleSubmit(handleAddPost)}
          >
            <h2 className="w-full h-auto border-b-black">Create new reels</h2>
            <div className="flex flex-col ">
              <Input
                className="outline-none border-b-2 border-b-[#ccc] focus:border-b-fuchsia-600"
                name="stt"
                type="text"
                placeholder="Please write a status for the post"
                control={control}
              ></Input>
              <div>
                <ImageUpload
                  onChange={onSeletecImage}
                  className="h-[350px]"
                  handleDeleteImage={handleDeleteImage}
                  name="image"
                  progress={progress}
                  image={image}
                ></ImageUpload>
              </div>
            </div>
            <button className=" bg-[#4cb5f9] w-full rounded-md h-8 text-white font-bold text-sm mt-2">
              Done
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNewPost;
