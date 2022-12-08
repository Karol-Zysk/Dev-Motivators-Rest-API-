import mongoose from "mongoose";
import slugify from "slugify";

export enum Place {
  main = "Main",
  waiting = "Waiting",
  purgatory = "Purgatory",
}

export interface MotivatorDocument extends mongoose.Document {
  title: string;
  subTitle: string;
  sluck: string;
  image: string;
  author: string;
  thumbUp: number;
  thumbDown: number;
  place: Place;
  createdAt: Date;
  updatedAt: Date;
  keyWords: string[];
  safeIn: number;
}

const motivatorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: [40, "Title must have less than or equal 40 characters"],
    },
    subTitle: {
      type: String,
      required: true,
      maxLength: [999, "Subtitle must have less than or equal 40 characters"],
    },
    slug: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      default: "Anonymus",
    },
    thumbUp: {
      type: Number,
      required: true,
      default: 0,
    },
    thumbDown: {
      type: Number,
      required: true,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    place: {
      type: String,
      enum: {
        values: [Place.main, Place.purgatory, Place.waiting],
      },
      default: Place.waiting,
    },
    keyWords: {
      type: [String],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

motivatorSchema.pre("save", function () {
  this.slug = slugify(this.title, { lower: true });
});

const Motivator = mongoose.model<MotivatorDocument>(
  "Motivator",
  motivatorSchema
);

export default Motivator;
