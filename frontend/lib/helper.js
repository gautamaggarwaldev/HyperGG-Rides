//Function to serialize the car data
export const serializedCarData = (car, wishlisted = false) => {
    return {
        ...car,
        price: car.price ? parseFloat(car.prie.toString()) : 0,
        createdAt: car.createdAt?.toISOString(),
        updatedAt: car.updatedAt?.toISOString(),
        whishlisted: whishlisted,
    };
};