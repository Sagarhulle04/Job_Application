import Job from "../models/jobs.schema.js";

export const createJob = async (req, res) => {
  const { companyName, jobTitle, jobDescription, skills, experience } =
    req.body;
  const pdf = req.file.filename;

  try {
    const user = req.user;

    console.log(user.role);

    if (user.role !== "recruiter") {
      return res
        .status(400)
        .json({ success: false, message: "Only recruiter can add the job" });
    }

    const pdfLink = "http://localhost:3000/pdf/" + pdf;

    const job = await Job.create({
      companyName,
      jobTitle,
      jobDescription,
      skills,
      experience,
      jobDescriptionPDF: pdfLink,
      user: req.user.id,
    });

    res
      .status(201)
      .json({ success: true, message: "Job created successfully", job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allJobList = async (req, res) => {
  try {
    const job = await Job.find().populate("user");

    res.status(200).json({ success: true, message: "All Jobs", job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJobPost = async (req, res) => {
  const { companyName, jobTitle, jobDescription, skills, experience } =
    req.body;
  try {
    const updatePost = {
      companyName,
      jobTitle,
      jobDescription,
      skills,
      experience,
    };

    if (req.file) {
      updatePost.jobDescriptionPDF =
        "http://localhost:3000/pdf/" + req.file.filename;
    }

    const post = await Job.findByIdAndUpdate(req.params.id, updatePost, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Job post updated successfully",
      updatePost,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Job Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const jobPostedByMe = async (req, res) => {
  try {
    const loggedInUser = req.user.id;

    const jobs = await Job.find();

    const postedJobs = jobs.filter(
      (job) => job?.user?._id.toString() === loggedInUser.toString(),
    );

    if (postedJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Jobs Posted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Jobs Posted By You",
      postedJobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
