import { Router } from "express";
import { createPersonalDetails } from "../controllers/personalDetails.controller.js";
import { createAccountDetails, verifyEmailOtp, verifyMobileOtp } from "../controllers/accountDetails.controller.js";
import { registerUser, loginUser, logoutUser, refreshAccessToken} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/personal-details", createPersonalDetails);
router.post("/account-details", createAccountDetails);
router.post('/verify-email-otp', verifyEmailOtp);
router.post('/verify-mobile-otp', verifyMobileOtp);
router.post('/registerCustomer', registerUser);
router.post('/loginCustomer', loginUser);
router.post('/logoutCustomer', verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
export default router;
