require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
	extended: true
}));
//comment
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
	res.render("home");
})

app.get("/register", function (req, res) {
	res.render("register");
})

app.post("/register", function (req, res) {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	});

	newUser.save(function (err) {
		if (!err) {
			res.render("secrets");
		} else {
			console.log(err);
		}
	});
});
app.route("/login")
	.get(function (req, res) {
		res.render("login");
	})

	.post(function (req, res) {
		const username = req.body.username;
		const password = req.body.password;

		User.findOne({
			email: username
		}, function (err, foundUser) {
			if (err) {
				console.log(err);
			} else {
				if (foundUser) {
					if (foundUser.password === password) {
						res.render("secrets");
					} else {
						res.send("password incorrect");
					}
				}
			}
		})
	});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});