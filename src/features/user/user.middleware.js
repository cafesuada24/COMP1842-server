import User from "./user.model.js";

async function validateUser(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User do not exists"
      }
      );
    }
    req.userData = user;
    next();
  } catch (error) {
    res.status(500).json(err);
  }
}

export { validateUser };
