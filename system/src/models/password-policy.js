import mongoose from'mongoose';

const AuthPolicySchema = new mongoose.Schema({       
    name                : { type: String, required: true, unique: true },    
    password_exp        : { type: Number, default: 365 },
    password_length     : { type: Number, default: 8 },
    passowrd_complex    : { type: Number, default: 1 }
},
{  
    strict              : true,
    timestamps          : true
});

const AuthPolicyModel = mongoose.model('AuthPolicy', AuthPolicySchema);
export default AuthPolicyModel;