import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt } = req.body;
    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (user.CreditBalance === 0 || user.CreditBalance < 0) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        CreditBalance: user.CreditBalance,
      });
    }
    if (!process.env.CLIPDROP_API) {
      return res.json({ success: false, message: "API key not configured" });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      CreditBalance: user.CreditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image Generated",
      CreditBalance: user.CreditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
