const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "intrested", "accepeted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send connection request to yourself!");
  }
  next();
});
const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequestModel;
