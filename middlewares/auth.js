const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../models/User')

dotenv.config()



exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token ||
                  req.body.token ||
                  req.header("Authorization")?.replace("Bearer ", "");
                  console.log("Request Headers:", req.headers);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token Missing' });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch the user and populate the additionalDetails field
      const user = await User.findById(decode.id).populate('additionalDetails');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      req.user = user;
      console.log('User with additional details:', req.user); // Log the populated user
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid Token' });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Something Went Wrong While Validating the Token',
    });
  }
};


exports.isAdmin = async (req, res, next) => {
    try{
        const userDetails= await User.findOne({email:req.user.email});
        if(userDetails.userType!=="admin"){
            return res.status(401).json({
				success: false,
				
				message: "This is a Protected Route for Admin",
			});
        }
        next();
    }
    catch(error) {
		return res
			.status(500)
			.json({ success: false, message: `Admin Role Can't be Verified` });
	}
}

exports.isuser = async (req, res, next) => {
    try{
        const userDetails= await User.findOne({email:req.user.email});
        if(userDetails.userType!=="user"){
            return res.status(401).json({
				success: false,
				
				message: "This is a Protected Route for user",
			});
        }
        next();
    }
    catch(error) {
		return res
			.status(500)
			.json({ success: false, message: `user Role Can't be Verified` });
	}
}


// // Auth Middleware
// exports.auth = async (req, res, next) => {
//     try {
//         const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
//         if (!token) {
//             return res.status(401).json({ success: false, message: `Token Missing` });
//         }

//         const decode = await jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decode;
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: `Invalid Token` });
//     }
// };

// // Role-Based Access Middleware
// exports.authorize = (...roles) => {
//     return async (req, res, next) => {
//         try {
//             const userDetails = await User.findOne({ email: req.user.email });
//             if (!userDetails || !roles.includes(userDetails.userType)) {
//                 return res.status(403).json({ success: false, message: "Unauthorized Access" });
//             }
//             next();
//         } catch (error) {
//             return res.status(500).json({ success: false, message: `Error: ${error.message}` });
//         }
//     };
// };
