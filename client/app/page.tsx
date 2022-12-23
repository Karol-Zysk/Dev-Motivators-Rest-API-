import { MotivatorType } from "../types";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import "../styles/globals.css";
import Image from "next/image";

async function getMotivators() {
  const res = await fetch(
    "http://127.0.0.1:4001/api/v1/motivators/getMotivatorsMain",
    {
      cache: "no-store",
      headers: {
        "x-foo": "bar",
      },
    }
  );
  const data = await res.json();

  return data;
}

export default async function MotivatorCards() {
  const data = await getMotivators();
  const { motivators } = data;

  return (
    <div className="w-2/5 p-4 mb-4 ml-auto mr-auto ">
      {!motivators || !motivators.length ? (
        <h1 className="text-3xl font-bold text-center">Loading...</h1>
      ) : (
        motivators.map((motivator: MotivatorType) => (
          <div
            key={motivator.id}
            className="p-4 mb-8 bg-gray-900 border-2 border-white rounded-md shadow-md shadow-slate-700"
          >
            <div className="flex justify-between w-full mb-4 ">
              <span className="text-xl font-semibold text-white">
                author: {motivator.author.login}
              </span>
              <div className="flex">
                <span className="flex items-center mr-3 text-lg font-bold text-white">
                  <FaRegThumbsUp className="mr-2 text-2xl text-blue-600" />
                  {motivator.thumbUp.length}
                </span>
                <span className="flex items-center text-lg font-bold text-white ">
                  <FaRegThumbsDown className="mr-2 text-2xl text-red-600" />
                  {motivator.thumbDown.length}
                </span>
              </div>
            </div>
            <div className="flex justify-center w-full mb-2">
              <Image
                src={motivator.photo}
                alt="image"
                width={500}
                height={500}
                className="object-cover w-72 h-72 "
              />
            </div>
            <h3 className="mt-4 text-3xl font-bold text-white">
              {motivator.title}
            </h3>
            <h4 className="mt-2 text-2xl font-medium text-white">
              {motivator.subTitle}
            </h4>
          </div>
        ))
      )}
    </div>
  );
}
