import AppliedJob from "../models/appliedJobs.schema.js";
import Job from "../models/jobs.schema.js";

export const applyJob = async (req, res) => {
  const resumePDF = req.file.filename;
  try {
    if (req.user.role === "recruiter") {
      return res
        .status(400)
        .json({ success: false, message: "Only Users Can Apply The Job" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload the resume" });
    }

    const jobIdLink = req.params.id;

    const job = await Job.findById(jobIdLink);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingUser = await AppliedJob.findOne({
      user: req.user.id,
      jobId: req.params.id,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "You have already applied the job" });
    }

    const resumeLink = "http://localhost:3000/appliedJobPdf/" + resumePDF;
    const appliedJob = await AppliedJob.create({
      user: req.user.id,
      jobId: jobIdLink,
      resume: resumeLink,
    });
    res
      .status(200)
      .json({ success: true, message: "Applied Job Successfully", appliedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const appliedJobs = async (req, res) => {
  try {
    if (req.user.role === "recruiter") {
      return res
        .status(400)
        .json({ success: false, message: "Recruiter cannot see applied jobs" });
    }

    const jobsApplied = await AppliedJob.find({
      user: req.user.id,
    })
      .populate("jobId")
      .populate("user");

    res.status(200).json({
      success: true,
      message: "Applied Job List",
      jobsApplied,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplication = async (req, res) => {
  try {
    const appliedJobs = await AppliedJob.find().populate("user");
    const jobs = await Job.find();

    const getAppliedJobDetails = jobs.filter((job) =>
      appliedJobs.some(
        (appliedJob) => appliedJob.jobId.toString() === job._id.toString(),
      ),
    );

    res.status(200).json({
      success: true,
      message: "Applications applied for the job",
      getAppliedJobDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
