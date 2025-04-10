const objVariables = require('../common/variables');
const objMessages = require('../common/messages');
const objNurseData = require("../models/nurses");
const jwt = require("jsonwebtoken");

const serCreateNewUser = async (user,res) =>
{
    try
    {
      const newUser = new UserData(user);
      await newUser.save();
      return res.status(objVariables.CreatedSuccessCode).json({ status : objMessages.Success , message: objMessages.UserCreatedSuccessfully });
    }
    catch (error)
    {
        return res.status(objVariables.ServerErrorCode).json({ status : objMessages.Failure, message: objMessages.SomethingWentWrong, error : error.message});
    }
}

const serVerifyUser = async (strUserName, strPassword,res) => {
 
  return await require('../controllers/userController').verifyUser(
      { body: { username: strUserName, password: strPassword } },
      res
  );
}

const serGetUserProfile = async (nurseId, res) => { 
  try
  {
    const nurseDetails = await NurseData.findById(nurseId);
    return res.json(nurseDetails);
  }
  catch (error)
  {
    return res.status(objVariables.ServerErrorCode).json({ status : objMessages.Failure, message: objMessages.SomethingWentWrong, error : error.message});
  }
};


const serGetNurseIdFromToken = async(strToken,res) =>
{
    try
    {
        const token = strToken.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        return decoded.id; 
    }
    catch (error)
    {
        console.log(objMessages.ErrorFetchingUserProfile, error.message);
        return res.status(objVariables.ServerErrorCode).json({ status : objMessages.Failure, message: objMessages.SomethingWentWrong, error : error.message});
    }
}

module.exports = {
    serCreateNewUser,
    serVerifyUser,
    serGetUserProfile,
    serGetNurseIdFromToken,
  };



