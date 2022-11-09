import express from "express";
const router = express.Router();

// middleware that is specific to this router
router.use((req: any, res: any, next: any) => {
  console.log("Time: ", Date.now());
  next();
});
// get all reminders by user email
router.get("/", (req: any, res: any) => {
  res.send("Birds home page");
});
// define the about route
router.get("/about", (req: any, res: any) => {
  res.send("About birds");
});

module.exports = router;
