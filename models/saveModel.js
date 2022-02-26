const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saveSchema = mongoose.Schema(
  {
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    blogId: {
      type: String,
    },
    blogTitle: {
      type: String,
    },
    blogDesc: {
      type: String,
    },
    blogWriter: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Save = mongoose.model("Save", saveSchema);

module.exports = { Save };
