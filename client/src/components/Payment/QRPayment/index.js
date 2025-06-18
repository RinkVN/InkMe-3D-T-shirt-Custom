import React from 'react'


const QRPayment = () => {
    const bank = "vietinbank"
    const accountNumber = "V3CASS66688889999"
    const amount = 790000
    const addInfo = "dong qop quy vac xin"
    const accountName = "Quy Vac Xin Covid"

    const qrCode = `https://img.vietqr.io/image/${bank}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`

    return (
        <div className='qr-payment' style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <img src={qrCode} alt="" />
        </div>
    )
}

export default QRPayment