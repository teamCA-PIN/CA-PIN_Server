import User from "../models/User";
import Cafeti from "../models/Cafeti";
const createError = require('http-errors');
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");

const fetchCafetiResult = async(userId, answers) => {
    const user = await User.findOne({_id: userId});
    if (user == null) {
        throw createError(statusCode.NOT_FOUND, responseMessage.READ_USER_FAIL);
    } else if (answers.length != 4) {
        throw createError(statusCode.BAD_REQUEST, responseMessage.INVALID_IDENTIFIER);
    }
    let result: string = "";
    switch (answers[0]) {
        case 0:
            result += "C";
            switch(answers[1]) {
                case 0:
                    result += "A";
                    break;
                case 1:
                    result += "S";
                    break;
                case 2:
                    result += "X";
                    break;
                default:
                    result += "U";
            }
            break;
        case 1:
            result += "N";
            switch(answers[1]) {
                case 0:
                    result += "T";
                    break;
                case 1:
                    result += "L";
                    break;
                case 2:
                    result += "J";
                    break;
                default:
                    result += "U";
            }
            break;
        default:
            result += "N";
    }
    
    switch (answers[2]) {
        case 0:
            result += "M";
            break;
        case 1:
            result += "V";
            break;
        case 2:
            result += "H";
            break;
        case 3:
            result += "F";
            break;
        case 4:
            result += "C";
            break;
        default:
            result += "L";
    }

    switch (answers[3]) {
        case 0:
            result += "D";
            break;
        case 1:
            result += "P";
            break;
        case 2:
            result += "B";
            break;
        case 3:
            result += "W";
            break;
        default:
            result += "L";
    }

    const cafeti = await Cafeti.findOne({type: result},{_id: false});
    cafeti.introduction = cafeti.introduction.replace(/\\n/g, '\n')
    // profileImg??? null????????? profileImg??? ????????? ?????? cafeti ??????????????? ??????(?????????????????? ?????? ??? ??????) => ????????? cafeti??????????????? ??????
    if ((!user.profileImg) || ((user.profileImg) && (user.profileImg.split('/').includes('cafeti')))) {
        await User.findOneAndUpdate(
            { 
                _id: userId 
            },
            { 
                cafeti: cafeti,
                profileImg: cafeti.plainImg
            },
            { 
                new: true,
                useFindAndModify: false
            }
        );
    } else {
        // profileImg??? null??? ????????? ???????????? ????????? ????????? ???????????? ???????????? ???????????? cafeti??? ????????????
        await User.findOneAndUpdate(
            { 
                _id: userId 
            },
            { 
                cafeti: cafeti
            },
            { 
                new: true,
                useFindAndModify: false
            }
        );
    }

    return cafeti
};


module.exports = {
    fetchCafetiResult
}