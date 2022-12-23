"use client";

import cookie from "js-cookie";

//Testing Update

const updateMotivator = async () => {
  const token = cookie.get("cookie");
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Origin", "http://localhost:3000");
  headers.append("Authorization", `Bearer ${token}`);

  //Update Motivator Function test with hardcoded values

  fetch("http://localhost:4001/api/v1/motivators/63a1a42c2bd2b9c77573a526", {
    headers: headers,
    method: "PATCH",
    credentials: "include",
    cache: "no-store",

    body: JSON.stringify({ title: "titttjjjjjjjjjjttle" }),
  })
    .catch((err) => {
      console.log(err);
    })
    .then((res) => {
      console.log(res);
      if (!res || !res.ok || res.status >= 400) {
        return;
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;
      // if (data.status) {
      //   setError(data.status);
      // } Add better error handling on backend
    });
};

const update = () => {
  return (
    <div>
      <button onClick={() => updateMotivator()}>XXXX</button>
    </div>
  );
};
export default update;
