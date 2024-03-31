const CategoryModel = require('../model/categoryModel');

// insert into database
exports.addCategory = async (req, res) => {
  let categoryObj = await CategoryModel.create({
    category_name: req.body.category_name,
  });

  let category = await CategoryModel.findOne({
    category_name: req.body.category_name
    })
    if (category) {
      // error
      return res.status(400).json({ error: "Category already exists" });
    } else {
      res.send(categoryObj);
    }

  if (!categoryObj) {
    // error
    return res.status(400).json({ error: "Something went wrong" });
  }
  // success
  res.send(categoryObj);
};

// to get all categories
exports.getAllCategories = async (req, res) => {
  let categories = await CategoryModel.find();
  if(!categories){
    return res.status(400).json({ error: "Something went wrong" });
  }else{
    res.send(categories);
  }
};

// to get category details
exports.getCategoryDetails = async(req, res) => {
  let category = await CategoryModel.findById(req.params.id);
  if(!category){
    return res.status(400).json({ error: "Something went wrong" });
  }else{
    res.send(category);
  }
}

// update category
exports.updateCategory = async (req, res) => {
  try{
    let categoryToUpdate = await CategoryModel.findByIdAndUpdate(req.params.id, {
      category_name: req.body.category_name
    }, {new:true});
    if(!categoryToUpdate){
      return res.status(400).json({ error: "Something went wrong" });
    }else{
      res.send(categoryToUpdate);
    }
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
}
// delete category
exports.deleteCategory = (req, res) => {
  CategoryModel.findByIdAndDelete(req.params.id)
  .then(deletedCategory => {
    if(!deletedCategory){
      return res.status(400).json({ error: "Something went wrong" });
    }else{
      res.send({message: "Category Deleted Successfully"});
    }
  })
  .catch(error => res.status(400).json({ error: err}));
}

/**
 * Model.find() -> returns all the data in the model = returns array
 * Model.find(filterObj) -> returns all the data in the model that matches/satisfies the filterObj returns array
 * Model.findOne(filterObj) -> returns first data that satisfies the filterObj returns object not an array
 * Model.findById(id) -> returns the data/row that has the given id -> {}
 */

/**
 * req.body => receive data from user using form
 * req.params -> receive data using params(url)
 * req.query -> receive data from url using variables
 * res.send(obj) -> 
 * res.status(status_code).send(obj)
 * status_code
 * 404: not found
 * 400: bad request
 * 200: ok
 * 500: Server Error
 * 
 * res.status(status_code).json
 * 
 */
// let categoryObj = new CategoryModel({
    //     category_name: req.body.category_name
    // })


    // const category = new CategoryModel(req.body);
    // category.save((err, data) => {
    //     if (err) {
    //         res.status(500).send({
    //             message: err.message || "Some error occurred while creating the Category."
    //         });
    //     } else {
    //         res.send(data);
    //     }
    // });

//     let categoryObj = CategoryModel.create({
//         category_name: req.body.category_name
//     }).then((data)=>{
//         res.send(data)
//     }).catch((error)=> {
//         res.status(500).send({
//             message: error.message || "Some error occurred while creating the Category."
//         });
//     })
// }
