const Product = require('../models/Product');



module.exports.addProduct = async (req, res) => {

  const newProduct = new Product(
    {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      pdf: null,
      userID: req.body.userID,
      likes: req.body.like,
      isShow:req.body.isShow,
    }
  );

  try {
    const savedProduct = await newProduct.save();
    console.log('gönderildi');
    res.status(201).json({
      message: 'Product is added successfully.',
      product: savedProduct,
    });
  } catch (err) {
    res.status(500).json({
      err,
      message: "hata porduct eklerken oldu"
    });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const updateFields = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      // Ensure other fields are handled appropriately
    };

    // Filter out undefined fields
    for (let key in updateFields) {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateFields,
        {
          new: true
        }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product is updated successfully.",
      updatedProduct
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Product is deleted successfully."
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const { category, userID, authorId, likedBy,title } = req.query; // Destructuring the query parameters from the request
    let whereClause = {}; // Initializing an empty where clause object for the Sequelize query

    // If a category is provided in the query, add it to the where clause
    if (category) {
      whereClause.category = category;
    }
    if (title) {
      whereClause.title =  { $regex: `.*${title}.*`, $options: 'i' };
    }

    if (authorId) {
      whereClause.authorId = authorId;
    }

    // If a user ID is provided in the query, add it to the where clause
    if (userID) {
      whereClause.userID = userID;
    }

    // If a likedBy query parameter is provided, filter products by the likedBy user ID
    if (likedBy) {
      whereClause.likes = { $elemMatch: { $eq: likedBy } };
    }

    // Execute the Sequelize findAll query, passing in the where clause and any desired limit
    const products = await Product.find(whereClause).populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "error at get products",
      data: error,
    });
  }
};

//like / dislike a post

//router.put("/:id/like",
module.exports.like = async (req, res) => {
  console.log('geldi');
  try {
    const Products = await Product.findByIdAndUpdate(req.params.id);
    console.log(Products);
    if (!Products.likes.includes(req.body.userId)) {
      await Products.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await Products.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The posttttttttt has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};