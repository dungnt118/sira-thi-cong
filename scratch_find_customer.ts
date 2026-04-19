import { customerService } from './src/services/core-contracts/services/customer.service';

async function test() {
    try {
        const res = await customerService.queryCustomersDto({ limit: 1 });
        console.log('Customers:', JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
