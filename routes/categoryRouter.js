const express = require("express");
const { Category } = require("../model/Category")
const router = express.Router();




// post method
router.post("/", async (req, res) => {
    const { name, icon, color } = req.body;
    
    const categoryFind = await Category.findOne({name});
    if (categoryFind) {
        res.status(200).send(`${name} Category already exist`);
    };
    
    let category = new Category({
      name,
      icon,
      color,
        
    });
    category = await category.save();
    if(!category){
        res.status(404).send("Category cannot be created")
    }
    res.send(category);
  
 
});



// Get all categories
router.get("/", async (req, res) => {
    const categoryList = await Category.find();
    if(!categoryList) {
        res.status(404).json({ success: false })
    };

    res.send(categoryList) ;
});

// get single category
router.get("/:id", async (req, res) => {
    const categoryList = await Category.findById(req.params.id);
    if(!categoryList) {
        res.status(404).send("The category with this id is not found")
    };
    res.send(categoryList) ;
});

// update category

router.put("/:id", async (req, res) => {
    const { name, icon, color} = req.body;
    const categoryList = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          icon,
          color,
        },
        {new: true}
    );
    if(!categoryList) {
        res.status(404).send("The category with this id is not found");
    }

    res.send(categoryList) ;
});

// Delete  category
router.delete("/:id", async (req, res) => {
    const categoryList = await Category.findByIdAndRemove(req.params.id);
    if(!categoryList) {
        res.status(404).send("The category with this id is not found");
    }

    res.send("Category deleted successfully");
});




module.exports = router;