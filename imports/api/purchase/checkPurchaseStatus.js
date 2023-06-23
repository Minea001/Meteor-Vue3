import SimpleSchema from "simpl-schema";
import Payment  from "../payment/payment";
import Purchase from "../purchase/purchase"

const checkPurchaseStatus=({purchaseId})=>{
    new SimpleSchema({
        purchaseId:String
    }).validate({purchaseId})
    try {
        let paymentDoc=Payment.aggregate([
            {
                $match:{purchaseId}
            },
            {
                $sort:{tranDate:1}
            },
            {
                //group Purchase id and sum paid
                $group:{
                    _id:'$purchaseId',
                    totalPaid:{$sum:{$add:['$paid','$discount']}},
                    //last date
                    tranDate:{$last:'$tranDate'}
                }
            }
        ])
        paymentDoc=paymentDoc[0] || {totalPaid:0}
        //get sale
        const purchaseDoc=Purchase.findOne({_id:purchaseId})
        if(paymentDoc.totalPaid==purchaseDoc.total){
            purchaseDoc.status='Closed'
            purchaseDoc.statusDate['closed']=paymentDoc.tranDate
        }else if(paymentDoc.totalPaid==0){
            purchaseDoc.status='Open'
            purchaseDoc.statusDate={
                open:purchaseDoc.statusDate.open
            }
        }else{
            purchaseDoc.status='Partial' 
            purchaseDoc.statusDate={
                open:purchaseDoc.statusDate.open,
                partial:purchaseDoc.tranDate
            }    
        }
        purchaseDoc.totalPaid=paymentDoc.totalPaid
        Purchase.update({_id:purchaseId},{$set:purchaseDoc})
    } catch (error) {
        throw err
    }
}
export default checkPurchaseStatus