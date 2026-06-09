import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    resume: {
      type: String,
      required: true,
      required: true,
    },
  },
  { timestamps: true },
);

const AppliedJob = mongoose.model("AppliedJob", appliedJobSchema);

export default AppliedJob;
