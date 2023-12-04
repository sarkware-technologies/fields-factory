import mongoose from'mongoose';

/**
 *
 * @author  : Sark
 * @version : 1.0.0
 * @description : 
 * 
 */

export const CountryGroupSchema = new mongoose.Schema({   
    name        : {type: String, required: true},
    handle      : { type: String, required: true, unique: true },
},
{  
    strict      : true,
    timestamps  : true
});

const CountryGroupModel = mongoose.model('CountryGroup', CountryGroupSchema);
export default CountryGroupModel;