import mongoose from'mongoose';

export const AuthTypeSchema = new mongoose.Schema({   
    name        : {type: String, required: true},
    handle      : { type: String, required: true, unique: true },
},
{  
    strict      : true,
    timestamps  : true
});

const AuthTypeModel = mongoose.model('AuthType', AuthTypeSchema);
export default AuthTypeModel;