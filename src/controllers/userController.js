const User = require("../models/user");
const crypto = require("crypto");
const jwtHelper = require('../helpers/jwtHelper')

const sha256 = crypto.createHash("sha256");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Fields can't be empty"
        })
    }
    await User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log(err);
        }
        else if (user) {
            if (crypto.createHash("sha256").update(password).digest("hex") !== user.password) {
                console.log("Invalid password")
                return res.json({
                    success: false,
                    message: "Invalid password"
                })
            }
            console.log("11")
            let token = jwtHelper.createToken(user);

            console.log(user.id)

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    username: user.username
                }
            })
        }
        else {
            const newUser = new User({
                username,
                password: crypto.createHash("sha256").update(password).digest("hex")
            });
            newUser.save()
                .then(user => {

                    let token = jwtHelper.createToken(user);

                    console.log("successful register" + token)
                    res.json({
                        success: true,
                        token,
                        user: {
                            id: user.id,
                            username: username
                        }
                    })
                })
        }

    })
}


exports.getAll = async (req, res) => {
    await User.find({}, "username", (err, users) => {
        if (err)
            console.log(err);
        else if (!users) {
            console.log("There isn't any user")
            return res.json({
                success: false,
                message: "There isn't any user"
            })
        }
        else {
            return res.json({
                success: true,
                users
            });
        }
    })
}
