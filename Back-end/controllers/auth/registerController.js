import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JWTService from "../../services/JWTService";
import { REFRESH_SECRET } from "../../config";
const registerController = {
  async register(req, res, next) {
    /*
     -> CHECKLIST
    [+] validate the request
    [+] authorise the request
    [+] check if user is in the database already
    [+] prepare model
    [+] generate JWT token
    [+] store in database
    [+] send response
    */

    // Validation

    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    //check if user is in the dataBase already

    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already registered")
        );
      }
    } catch (err) {
      return next(err);
    }

    //Hash Password
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    //prepare the model
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    let access_token, refresh_token;
    try {
      const result = await user.save();
      //Tokens
      access_token = JWTService.sign({
        _id: result._id,
        role: result.role,
      });

      refresh_token = JWTService.sign(
        {
          _id: result._id,
          role: result.role,
        },
        "1y",
        REFRESH_SECRET
      );
      //DataBase for refresh token
      await RefreshToken.create({ token: refresh_token });
    } catch (err) {
      return next(err);
    }
    /*---------------------------------*/
    res.json({ access_token: access_token, refresh_token: refresh_token });
  },
};

export default registerController;
