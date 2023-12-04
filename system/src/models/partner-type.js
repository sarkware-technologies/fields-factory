import mongoose from'mongoose';

/**
 *
 * @author  : Sark
 * @version : 1.0.0
 * @description : organization, branch, supplier, customer, user, employee
 *
 */

export const PartnerTypeSchema = new mongoose.Schema({   
    name        : {type: String, required: true},
    handle      : { type: String, required: true, unique: true },
},
{  
    strict      : true,
    timestamps  : true
});

const PartnerTypeModel = mongoose.model('PartnerType', PartnerTypeSchema);
export default PartnerTypeModel;