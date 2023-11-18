import Sidebar from "components/itemsHomePage/Sidebar";
import ImageItem from "components/personalIMG/ImageItem";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PersonalPage = () => {
  const { userInfo } = useAuth();
  const [params] = useSearchParams();
  const userName = params.get("userName");
  const [post, setPost] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const docRef = collection(db, "posts");
      const qs = query(docRef, where("PostNameId", "==", userName));
      onSnapshot(qs, (snapshot) => {
        const results = [];
        snapshot.forEach((item) => {
          results.push({
            id: item.id,
            ...item.data(),
          });
        });
        setPost(results);
      });
    }
    fetchData();
  }, [userName]);

  const [user, setUser] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "users");
    const qs = query(colRef, where("username", "==", userName));
    onSnapshot(qs, (snapshot) => {
      const results = [];
      snapshot.forEach((item) => {
        results.push({
          id: item.id,
          ...item.data(),
        });
      });
      setUser(results);
    });
  }, [userName]);
  const navigate = useNavigate();
  return (
    <div className="per">
      <Sidebar></Sidebar>
      <div className="w-full sm:w-4/5 z-1 pt-14 "></div>
      <div className="flex flex-wrap justify-center sm:justify-end">
        {user.map((index) => (
          <div
            key={index.id}
            className="person-con flex justify-center w-full sm:justify-end"
          >
            <div className="flex">
              <img
                src={
                  index.avatar ||
                  "https://w7.pngwing.com/pngs/86/421/png-transparent-computer-icons-user-profile-set-of-abstract-icon-miscellaneous-monochrome-computer-wallpaper.png"
                }
                alt=""
                className="per-avar object-cover w-40 h-40 border-2 border-gray-600 rounded-full"
              />
            </div>
            <div className="w-1/2 h-10 pl-5 mt-10 ss:pl-20 sm:pl-30 ">
              {userInfo.email === index.email && (
                <div
                  onClick={() => navigate(`/Personal/EditUser?id=${index.id}`)}
                  className="flex items-center cursor-pointer"
                >
                  <p className="edit-pro text-xs sm:text-lg">Edit profile</p>
                  <i className="flex cursor-pointer bx bxs-edit-alt"></i>
                </div>
              )}
              <div className="mt-2 mb-5 text-xl font-bold">
                {index.status === 2 ? (
                  <p className="flex items-center px-2 text-2xl font-semibold">
                    {index?.username || index.fullname}{" "}
                    <i className="text-blue-500 bx bxs-brightness"></i>{" "}
                  </p>
                ) : (
                  <p className="px-2 text-2xl font-medium">
                    {index?.username || index.fullname}
                  </p>
                )}
              </div>
              <p>{post.length} Messages</p>
            </div>
          </div>
        ))}

        <div className="person-iten item-insta flex flex-wrap justify-center w-full h-auto mt-5 border-t-2 border-black sm:justify-start sm:w-4/5">
          {post.map((item) => (
            <ImageItem key={item.id} data={item}></ImageItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
