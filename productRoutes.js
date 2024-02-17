// import

const { protect } = require("./authMiddleware");

router.post("/", protect, createProduct);

// router.post("/", createProduct)
// router.post("/", createProduct)
// router.post("/", createProduct)

// export
