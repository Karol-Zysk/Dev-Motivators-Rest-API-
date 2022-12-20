import { MotivatorType } from "../types";
import Link from "next/link";
import "../styles/globals.css";

async function getMotivators() {
  const res = await fetch("http://127.0.0.1:4000/api/v1/motivators", {
    cache: "no-store",
    headers: {
      "x-foo": "bar",
    },
  });
  const data = await res.json();

  return data.data.allMotivators;
}

export default async function MotivatorCards() {
  const motivators = await getMotivators();

  return (
    <div>
      <Link href="/login"></Link>
      {!motivators ? (
        <h1>Loading...</h1>
      ) : (
        motivators.map((motivator: MotivatorType) => (
          <div key={motivator.id}>
            <p>Title: {motivator.title}</p>
            {/* <p>SubTitle: {motivator.subTitle}</p>
            <p>Place: {motivator.place}</p> */}
            {/* <p>Likes: {motivator.thumbUp.length}</p> */}
            {/* <p>DisLikes: {motivator.thumbDown.length}</p> */}
          </div>
        ))
      )}
    </div>
  );
}
