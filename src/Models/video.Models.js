import mongoose, { plugin, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: [true, "VideoFile is required!!"],
    },
    thumbnail: {
      type: String, // cloudinary url
      required: [true, "ThumbNail is required!!"],
    },
    title: {
      type: String, // cloudinary url
      required: [true, "Title is required!!"],
    },
    desciption: {
      type: String, // cloudinary url
      required: [true, "Desciption is required!!"],
    },
    title: {
      type: String,
      required: [true, "Category is required!!"],
    },

    duration: {
      type: Number,
      required: [true, "Duration is required!!"],
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required!!"],
    },
  },
  {
    timestamps: true, // this will add createdAt and updatedAt fields automatically
  }
);

videoSchema,plugin(mongooseAggregatePaginate);

export const Mvideo = mongoose.model("Mvideo", videoSchema);
