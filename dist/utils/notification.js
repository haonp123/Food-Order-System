"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOTP = exports.generateOTP = void 0;
const mailtrap_1 = require("mailtrap");
const config_1 = require("../config");
// OTP
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let otp_expiry = new Date();
    otp_expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, otp_expiry };
};
exports.generateOTP = generateOTP;
const onRequestOTP = (otp, toEmail) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(otp, toEmail);
    const client = new mailtrap_1.MailtrapClient({ token: config_1.MAILTRAP_TOKEN });
    const sender = {
        email: "hello@demomailtrap.com",
        name: "Food Order - OTP Mail",
    };
    const recipients = [
        {
            email: toEmail,
        },
    ];
    client
        .send({
        from: sender,
        to: recipients,
        template_uuid: config_1.MAILTRAP_TEMPLATE_OTP_MAIL,
        template_variables: {
            opt_value: otp,
        },
    })
        .then(console.log, console.error);
});
exports.onRequestOTP = onRequestOTP;
//# sourceMappingURL=notification.js.map