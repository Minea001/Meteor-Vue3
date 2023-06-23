import SimpleSchema from "simpl-schema";
import Sale from '../sale/sale'
Meteor.methods({
GetSaleByDateId(id){
    return Sale.findOne({_id:id})
},
findSale({selector,page,rowsPerPage}){
    if(!Meteor.isServer) return false
    selector=selector || {}
    const limit=rowsPerPage===0?Number.MAX_SAFE_INTEGER:rowsPerPage
    const skip =rowsPerPage*(page-1)
    const data=Unit.aggregate([
        {
            $match:selector,
        },
        {
            $skip:skip,
        },
        {
            $limit:limit,
        },
      
    ])
    const total=Sale.find(selector).count()
    return {data,total}
},
})