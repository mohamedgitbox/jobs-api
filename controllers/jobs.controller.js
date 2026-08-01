const Job = require("../models/JobModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  if (!jobs) {
    throw new NotFoundError("There is not jobs yet");
  }

  res.status(StatusCodes.OK).json({ jobs });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`job with id (${jobId}) not found`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("company and position can not be empty");
  }
  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedJob) {
    throw new NotFoundError(`job with id (${jobId}) not found`);
  }

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findByIdAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) {
    throw new NotFoundError(`job with id (${jobId}) not found`);
  }
  res.status(StatusCodes.OK).json("deleted ");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
