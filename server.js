const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

require("./routes/spotifyRoutes")(app);

// app.route(function(req, res) {
//     res.sendFile(path.join(__dirname, "../client/public/index.html"));
// });


app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
});

module.exports = app;