const router = require("express").Router();
const Posts = require("../models/Posts");
const Categories = require("../models/Categories");
const multer = require("multer");
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const Navbar = require('../models/NavbarCategories')
const Phrase = require('../models/Day-Phrase')
const Auth = require('../models/Auth')
const jwt = require('jsonwebtoken')


const validate = (req,res,next) => {
  const token = req.headers.token
  jwt.verify(token, process.env.SECRET, (err, user)=>{
    if(err){
      res.send('Access denied')
    }else{
      next()
    }
  })
 
}

const s3 = new aws.S3({
  accessKeyId: "AKIA6HK2ZBTXUYLB4QWB",
  secretAccessKey: "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",
  ACL: "public-read",
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "lujan-en-5",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

//auth
router.post("/auth", async (req,res) => {
  const {user, password} = req.body
  try {
    const data = await Auth.find({})
    if(user === data[0].user & password === data[0].password){
      const token = jwt.sign(user, process.env.SECRET)
      res.status(200).json({token: token})
    }else{
      res.status(500).json('incorrect user or password')
    }
    // res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error);
  }
})


router.put("/auth", async (req, res) => {
  const deletePrevious = await Auth.deleteMany({});

  const newData = new Auth({
    user: req.body.user,
    password: req.body.password
  });

  newData
    .save()
    .then(() => res.json("data updated"))
    .catch((err) => res.status(400).json(err));
});
//Day Phrase
router.get('/phrase', async (req,res) => {
  try {
    const phrase = await Phrase.find({})
    res.status(200).json(phrase)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.put("/phrase", async (req, res) => {
  const deletePrevious = await Phrase.deleteMany({});

  const phrase = new Phrase({
    phrase: req.body.phrase,
  });

  phrase
    .save()
    .then(() => res.json("new phrase updated"))
    .catch((err) => res.status(400).json(err));
});



// Categories
router.get("/category/select", async (req, res) => {
  try {
    const categories = await Categories.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/category/select", async (req, res) => {
  const deletePrevious = await Categories.deleteMany({});

  const categories = new Categories({
    categories: req.body.categories,
  });

  categories
    .save()
    .then(() => res.json("new article posted"))
    .catch((err) => res.status(400).json(err));
});




router.get("/categories/navbar", async (req, res) => {
  try {
    const categories = await Navbar.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});



router.put("/categories/navbar", async (req, res) => {
  const deletePrevious = await Navbar.deleteMany({});

  const categories = new Navbar({
    categories: req.body.categories,
  });

  categories
    .save()
    .then(() => res.json("Categories Updated"))
    .catch((err) => res.status(400).json(err));
});

//CREATE POST

router.post("/",validate, upload.single("photo"), (req, res) => {
  const newPost = new Posts({
    title: req.body.title,
    description: req.body.description,
    creator: req.body.creator,
    category: req.body.category,
    copete: req.body.copete,
    photo: req.file.location,
  });
  newPost
    .save()
    .then(() => res.json("new article posted"))
    .catch((err) => res.status(400).json(err));
});

//Set main value to false
router.patch("/:id", async (req, res) => {
  try {
    const update = await Posts.updateMany({}, { $set: { main: false } });
    const setToTrue = await Posts.findByIdAndUpdate(req.params.id, {
      $set: { main: true },
    });
    res.status(200).json(setToTrue);
  } catch (error) {
    res.status(400).json(error);
  }
});

//GET ALL POST
router.get("/", async (req, res) => {
  const { category, title } = req.query;
  const queryObject = {};
  if (category) {
    queryObject.category = category;
  }
  if (title) {
    queryObject.title = { $regex: title, $options: "i" };
  }

  try {
    const allPosts = await Posts.find(queryObject).sort({ _id: -1 });
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(400).json(error);
  }
});

//GET SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    const singlePost = await Posts.findById(req.params.id);
    res.status(200).json(singlePost);
  } catch (error) {
    res.status(400).json(error);
  }
});

//Update categories to show

router.put("/categoriesToShow", async (req, res) => {});

//UPDATE POST
router.put("/:id",validate, upload.single("photo"), async (req, res) => {
  const updates = {
    title: req.body.title,
    description: req.body.description,
    creator: req.body.creator,
    copete: req.body.copete,
    category: req.body.category,
  };
  if (req.file) {
    const image = req.file.location;
    updates.photo = image;
  }
  try {
    const UpdatedPost = await Posts.findByIdAndUpdate(
      req.params.id,
      {
        $set: updates,
      },
      { new: true }
    );
    res.status(200).json(UpdatedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE POST
router.delete("/:id", validate, async (req, res) => {
  try {
    const deletePost = await Posts.findById(req.params.id);
    await deletePost.delete();
    res.status(200).json(deletePost);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
