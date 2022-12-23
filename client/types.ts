export type MotivatorType = {
  _id: string;
  title: string;
  subTitle: string;
  photo: string;
  thumbUp: [string];
  thumbDown: [string];
  createdAt: Date;
  place: string;
  keyWords: [string];
  author: {
    _id: string;
    login: string;
    id: string;
  };
  slug: string;
  id: string;
};
