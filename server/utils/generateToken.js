// import jwt from "jsonwebtoken";

// const generateToken = (res, user, message) => {
//   const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//     expiresIn: "1d",
//   });
//   return res
//     .status(200)
//     .cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     }).json({
//         success:true,
//         message,
//         user
//     });
// };


// export default generateToken






import jwt from "jsonwebtoken";

const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ Needed for HTTPS
      sameSite: "None", // ✅ Allows cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      user,
    });
};

export default generateToken;



