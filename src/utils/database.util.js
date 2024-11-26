import mongoose from "mongoose";

export const runInTransaction = async (callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await callback(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    console.error(error);
    throw error;
  } finally {
    await session.endSession();
  }
};
