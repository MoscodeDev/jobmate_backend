import User from "../models/users.models.js";
import bcrypt from "bcryptjs";


const createUser = async (req,res)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password) return res.status(400).json({message: "Please fill all fields"});
    try {
        const userExists = await User.findOne({ email });
        if(userExists) return res.status(400).json({message: "User already exists"});
        const hashedPassword  = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});
        if(!user) return res.status(400).json({message: "User creation failed"});

        res.status(201).json({
            message: "User created successfully", 
            user: {_id: user._id, name: user.name, email: user.email}});
        
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message});
        
    }
};

const loginUser = async (req, res, next) =>{
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({message: "Please fill all fields"});
    try {
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({message: "User does not exist"});
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({message: "Invalid credentials"});

        req.login(user, (err)=>{
            if(err) return next(err);
            return res.status(200).json({message: "Login successful", user: {_id: user._id, name: user.name, email: user.email}});
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message});
    }
}
 
const logoutUser =  (req, res, next) =>{
    req.logout((err) =>{
        if(err) return next(err);

        req.session.destroy(()=>{
            res.clearCookie('connect.sid')
          return  res.status(200).json({message: "User logged out successfully"});
        })
        })

};

const getUser = (req, res) =>{
    console.log(req.user)
    res.json(req.user)
}

const editUser = async(req, res) =>{
    const {name, email, password, oldPassword} = req.body;
    try {
        let user =await User.findById(req.user._id) ;
        if(!user) return res.status(400).json({message:"user not found."});
        if(name) user.name = name
        if(email) user.email = email
        if(password && oldPassword){
            const isPasswordValid =await bcrypt.compare(oldPassword, user.password);
            if(!isPasswordValid) return res.status(400).json({message: "invalid old password"});
            const encryptedPassword =await bcrypt.hash(password, 10);
            user.password = encryptedPassword;
        
        }

        const updatedUser =await user.save();
        return res.status(200).json({_id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, createdAt: updatedUser.createdAt, updatedAt: updatedUser.updatedAt});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
        
    }
};

export { createUser, loginUser, logoutUser, getUser, editUser };