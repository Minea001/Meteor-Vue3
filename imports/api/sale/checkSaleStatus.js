import SimpleSchema from "simpl-schema"
import Reciept from "../reciept/reciept"
import Sale from "./sale"

const checkSaleStatus = ({ saleId }) => {
    new SimpleSchema({
        saleId: String
    }).validate({ saleId })
    try {
        let receiptDoc = Reciept.aggregate([
            {
                $match: { saleId }
            },
            {
                $sort:{tranDate:1}
            },
            {
                //group saleId and sum តម្លៃលុយដែលទទួលបានដើម្បីដឹងថាបង់ដាច់នៅ
                $group: {
                    _id: '$saleId',
                    totalReceived:{$sum:{$add:['$recieve','$discount']}},
                    //យកថ្ងៃចុងក្រោយគេ
                    tranDate: { $last: '$tranDate' }
                }
            }
        ])

        receiptDoc = receiptDoc[0] || { totalReceived: 0 }

        // Get sale
        const saleDoc = Sale.findOne({ _id: saleId })

        if (receiptDoc.totalReceived == saleDoc.total) {
            saleDoc.status = 'Closed'
            saleDoc.statusDate['closed'] = receiptDoc.tranDate
            /***
             * status = Closed
             * statusDate = { open:2022/05/11,partial:date, closed:date }
             * totalReceived = receiptDoc.totalReceived
             */
        } else if (receiptDoc.totalReceived == 0) {
            saleDoc.status = 'Open'
            saleDoc.statusDate = {
                open: saleDoc.statusDate.open
            }
            /***
             * status = Open
             * statusDate = { open:2022/05/11 }
             * totalReceived = 0 
             */
        } else {
            saleDoc.status = 'Partial'
            saleDoc.statusDate = {
                open:saleDoc.statusDate.open,
                partial: receiptDoc.tranDate
            }
            /***
             * status = Partial
             * statusDate = { open:2022/05/11, partial:date }
             * totalReceived = receiptDoc.totalReceived
             */
        }
        saleDoc.totalReceived = receiptDoc.totalReceived
        // Update sale 
        Sale.update({ _id: saleId }, { $set: saleDoc })
    } catch (err) {
        throw err
    }
}

export default checkSaleStatus