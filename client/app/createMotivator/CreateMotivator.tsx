import { useState } from "react";
import cookie from "js-cookie";
import axios from "axios";

const CreateMotivator: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [keyWords, setKeyWords] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      data: { signature, timestamp },
    } = await axios("/api/motivator/cloudinary-sign");
    console.log(signature, timestamp);

    try {
      // SENDING IMAGE TO CLOUDINARY
      const formData = new FormData();
      if (photo) {
        formData.append("file", photo);
      }
      // formData.append("upload_preset", "my_presset");
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append(
        "api_key",
        `${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}`
      );

      let headers = new Headers();
      headers.append("Origin", "http://localhost:3000");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          headers: headers,
          body: formData,
        }
      );
      //GETTING IMAGE ADRESS
      const data = await response.json();
      setImage(data.secure_url);
      console.log(data);
      const token = cookie.get("cookie");
      const createResponse = await fetch(
        "http://localhost:4001/api/v1/motivators",
        {
          method: "POST",
          body: JSON.stringify({
            keyWords,
            photo: data.secure_url,
            title,
            subTitle,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            Origin: "http://localhost:3000",
          },
        }
      );

      // Pobieranie odpowiedzi z serwera
      const createData = await createResponse.json();
      console.log(createData);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="p-4 bg-gray-800 rounded-lg" onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      <label className="block text-gray-300" htmlFor="title">
        Title:
      </label>
      <input
        className="w-full p-2 bg-gray-700 rounded-lg"
        type="text"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      <label className="block text-gray-300" htmlFor="subTitle">
        Description:
      </label>
      <input
        className="w-full p-2 bg-gray-700 rounded-lg"
        type="text"
        name="subTitle"
        value={subTitle}
        onChange={(event) => setSubTitle(event.currentTarget.value)}
      />

      <label className="block text-gray-300" htmlFor="keyWords">
        Key words (separated by commas):
      </label>
      <input
        className="w-full p-2 bg-gray-700 rounded-lg"
        type="text"
        name="keyWords"
        value={keyWords.join(",")}
        onChange={(event) => setKeyWords(event.target.value.split(","))}
      />
      <br />
      <label className="block text-gray-300" htmlFor="photo">
        Image:
      </label>
      <input
        className="w-full p-2 bg-gray-700 rounded-lg"
        type="file"
        accept="image/*"
        name="photo"
        onChange={(event) =>
          setPhoto(event.target.files && event.target.files[0])
        }
      />
      <br />
      <button className="p-2 mt-4 bg-gray-300 rounded-lg" type="submit">
        Create Motivator
      </button>
    </form>
  );
};

export default CreateMotivator;
