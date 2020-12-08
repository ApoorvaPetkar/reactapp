interface IOrder {
    orderId: number;
    orderDate: string;
    customerReference: string;
    customerFeedback: string;
    billingAddress: string;
    shippingAddress: string;
    units: number;
    productId: number;
    unitPrice: number;
    discount : number;
    taxAmount: number;
    remarks: string;
    customerProductFeedback?: string;

}

export {
    IOrder
};
