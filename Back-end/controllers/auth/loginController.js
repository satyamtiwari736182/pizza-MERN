import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JWTService from "../../services/JWTService";
import bcrypt from "bcrypt";
import { RefreshToken, User } from "../../models";
import { REFRESH_SECRET } from "../../config";

const loginController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) return next(CustomErrorHandler.incorrectCredentials());

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return next(CustomErrorHandler.incorrectCredentials());
      //compare password
      console.log("helooooo  ", req.body.password, user.password);
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return next(CustomErrorHandler.incorrectCredentials());

      //Token
      const access_token = JWTService.sign({ _id: user._id, role: user.role });
      const refresh_token = JWTService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      // DataBase whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token: access_token, refresh_token: refresh_token });
    } catch (err) {
      return next(err);
    }
  },

  async logout(req, res, next) {
    //validation
    const logoutSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = logoutSchema.validate(req.body);
    if (error) return next(error);

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token });
    } catch (error) {
      return next(new Error("Something went wrong in the database"));
    }
    res.json({ status: 1 });
  },
};
export default loginController;
