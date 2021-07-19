import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
import fs from "fs";
import { Product } from "../models";
import productSchema from "../validators/productValidators";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}--${Math.round(
      Math.random() * 1e9
    )}_${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("image");

const productController = {
  /*---------------------------------------------*/
  async store(req, res, next) {
    //multipart form data
    handleMultipartData(req, res, async (err) => {
      if (err) return next(CustomErrorHandler.serverError(err.message));
      // console.log(req.file);
      const filePath = req.file.path;

      //validation
      const { error } = productSchema.validate(req.body);

      if (error) {
        // Delete the uploaded file
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) return next(CustomErrorHandler.serverError(err.message));
        });
        return next(error);
      }

      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.create({ name, price, size, image: filePath });
      } catch (err) {
        return next(err);
      }
      // console.log(document);
      res.status(201).json(document);
    });
  },

  /*---------------------------------------*/
  update(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) return next(CustomErrorHandler.serverError(err.message));
      console.log(req.file);
      let filePath;
      if (req.file) filePath = req.file.path;

      //validation
      const { error } = productSchema.validate(req.body);
      if (error) {
        // Delete the uploaded file
        if (req.file) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            if (err) return next(CustomErrorHandler.serverError(err.message));
          });
        }

        return next(error);
      }

      const { name, price, size } = req.body;
      let document;
      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            name,
            price,
            size,
            ...(req.file && { image: filePath }),
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }
      console.log(document);
      res.status(201).json(document);
    });
  },

  /*----------------------------------------------*/
  async remove(req, res, next) {
    const document = await Product.findOneAndRemove({ _id: req.params.id });
    if (!document) return next(new Error("Nothing to Delete"));

    const imgPath = document._doc.image;
    fs.unlink(`${appRoot}/${imgPath}`, (err) => {
      if (err) return next(CustomErrorHandler.serverError());
    });
    res.json(document);
  },

  /*--------------------------------------------*/
  async showAll(req, res, next) {
    let documents;
    // pagination mongoose-paginations
    try {
      documents = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 });
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  /*---------------------------------------------*/
  async showOne(req, res, next) {
    let document;
    try {
      document = await Product.findOne({ _id: req.params.id }).select(
        "-updatedAt -__v"
      );
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
  /*---------------------------------------------*/
  async getProducts(req, res, next) {
    let documents;
    try {
        documents = await Product.find({
            _id: { $in: req.body.ids },
        }).select('-updatedAt -__v');
    } catch (err) {
        return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
},
/*---------------------------------------------------*/
};
export default productController;
