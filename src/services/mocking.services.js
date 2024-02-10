import { fakerES_MX as faker } from '@faker-js/faker';

const data = [];

for (let i = 0; i < 100; i++) {
    const entry = {
        "title": faker.commerce.productName(),
        "description": faker.lorem.sentence(),
        "price": faker.commerce.price(),
        "thumbnail": faker.image.url(),
        "code": faker.number.int({ min: 100000, max: 999999 }),
        "stock": faker.number.int({ min: 0, max: 100 }),
        "category": faker.commerce.department(),
        "estado": faker.datatype.boolean(),
        "id": i
    };
    data.push(entry);
}

const products = JSON.stringify(data); // Convierte el array a JSON

export { products };
