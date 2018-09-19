require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const {isAuthenticated, isAuthorized } = require("./middleware/auth");
const db = require("./models");

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

//  --- ROUTES ---
app.use("/api/auth", authRoutes);

app.use("/api/users/:id/messages", isAuthenticated, isAuthorized, messagesRoutes);
  
app.get("/api/messages", isAuthenticated, async function(req, res, next) {
   try {
      let messages = await db.Message.find()
        .sort({ createdAt: "desc" })
        .populate("user", {
          username: true,
          profileImageUrl: true
        });
      return res.status(200).json(messages);
   } catch (err) {
      return next(err);
   }
});


// if route does not exists,
// throw new error with 404 status
// then go the error handler
app.use((req, res, next) => {
    let err = new Error("Page Not Found");
    err.status = 404;
    next(err);
});

// error handler
// throws error as json
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})