interface IInventory {
    productId: number;
    title: string;
    description: string;
    unitsInStock: number;
    unitPrice: number;
    sellingPrice: number;
    itemDiscount: number;
    remarks: string;
}

export {
    IInventory
};
