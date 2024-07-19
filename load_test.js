import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const options = {
    stages: [
        { duration: '1m', target: 50 },     // 50 utlizadores em 1 minuto
        { duration: '3m', target: 100 },
        { duration: '5m', target: 140 },
        { duration: '3m', target: 0 },
    ],
}

const customFails = new Counter('custom_fails')

export default function() {
    const res = http.get('https://gorest.co.in/public/v2/todos')

    const result = check(res, {
        'status was 200': (r) => r.status === 200,
        'array content': (r) => Array.isArray(r.json)
    })

    if(!result) {
        customFails.add(1)
    }

    sleep(1)
}

