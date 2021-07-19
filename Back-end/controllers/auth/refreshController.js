import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JWTService from "../../services/JWTService";

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) return next(error);

    //Database
    let refreshtoken;
    try {
      refreshtoken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshtoken)
        return next(CustomErrorHandler.unAuthorized("invalid refresh token"));

      let userId;
      try {
        const { _id } = await JWTService.verify(
          refreshtoken.token,
          REFRESH_SECRET
        );
        userId = _id;
        console.log(userId);
      } catch (error) {
        return next(CustomErrorHandler.unAuthorized("invalid refresh token"));
      }

      const user = User.findOne({ _id: userId });
      if (!user) return next(CustomErrorHandler.unAuthorized("No user found"));

      const access_token = JWTService.sign({ _id: user._id, role: user.role });
      const refresh_token = JWTService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      // DataBase whitelist
      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token: access_token, refresh_token: refresh_token });
    } catch (error) {
      return next(new Error("Something went Wrong!!...", error.message));
    }
  },
};

export default refreshController;
