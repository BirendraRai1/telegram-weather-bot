const User = require("../models/user");
const Setting = require("../models/setting");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const blockUnblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    let blocked = req.body.blocked;
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isBlocked = blocked;
    user.isSubscribed = false;
    await user.save();
    if (blocked) {
      res.json({ message: "User blocked" });
    } else {
      res.json({ message: "User unblocked" });
    }
  } catch (error) {
    console.log("error is", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { apiKey, key, value } = req.body;
    console.log("apikey,key, value ", apiKey, key, value);

    if (!key || !value) {
      return res.status(400).json({ error: "Key and value required" });
    }
    let setting;
    const findSetting = await Setting.find({ key: apiKey });
    console.log("findSetting is",findSetting)
    if (!findSetting){
      setting = await Setting.create({ key, value });
      console.log("setting inside if ",setting)
    }else {
      setting = await Setting.findOneAndUpdate(
        { key: apiKey },
        { value },
        { new: true, upsert: true }
      );
    }

    console.log("setting is ", setting);
    res.json(setting);
  } catch (error) {
    console.log("error is", error);
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getUsers,
  blockUnblockUser,
  getSettings,
  updateSetting,
};
