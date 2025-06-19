import React, { useContext } from 'react'
import { MyContext } from '../../../context/MyConext';

const QRPayment = ({ order }) => {
    const context = useContext(MyContext);

    // Lấy orderId từ prop order, fallback về context.orderData?.orderId nếu chưa có
    const orderId = order?.orderId || order?._id || context.orderData?.orderId || '';

    const orderData = {
        // orderCode: Number(String(Date.now()).slice(-6)),
        amount: context.cartData.reduce((total, item) => total + item.price * item.quantity, 0),
        // description: "Thanh toan don hang",
        items: context.cartData.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        bank: "bidv",
        accountNumber: "V3CASS66688889999",
        template: "print.png",
        addInfo: orderId ,
        // + " - " + context.selectedAddressId,
        accountName: "NGUYEN TIEN DAT",
        returnUrl: `${window.location.origin}/checkout?success=true`,
        cancelUrl: `${window.location.origin}/checkout?canceled=true`,
    };

    const qrCode = `https://img.vietqr.io/image/${orderData.bank}-${orderData.accountNumber}-${orderData.template}?amount=${orderData.amount}&addInfo=${orderData.addInfo}&accountName=${orderData.accountName}`

    return (
        <div className='qr-payment'
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <img src={qrCode} alt="QR Code" />
        </div>
    )
}

export default QRPayment