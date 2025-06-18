import React, { useContext } from 'react'
import { MyContext } from '../../../context/MyConext';


const QRPayment = () => {

    const context = useContext(MyContext);

    const orderData = {
        orderCode: Number(String(Date.now()).slice(-6)),
        amount: context.cartData.reduce((total, item) => total + item.price * item.quantity, 0),
        description: "Thanh toan don hang",
        items: context.cartData.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        bank: "vietinbank",
        accountNumber: "V3CASS66688889999",
        addInfo: "Bac Ninh",
        accountName: "NGUYEN TIEN DAT",
        returnUrl: `${window.location.origin}/checkout?success=true`,
        cancelUrl: `${window.location.origin}/checkout?canceled=true`,
    };

    const qrCode = `https://img.vietqr.io/image/${orderData.bank}-${orderData.accountNumber}-compact2.jpg?amount=${orderData.amount}&addInfo=${orderData.addInfo}&accountName=${orderData.accountName}`

    return (
        <div className='qr-payment'
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <img src={qrCode} alt="" />
        </div>
    )
}

export default QRPayment