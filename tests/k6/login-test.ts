import http from "k6/http";
import { check, sleep } from "k6";


const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

export const options = {
    vus: 100,
    duration: '30s',
    thresholds:{
        http_req_duration:['p(95)<500'],
    }
};

export default function () {
    const res = http.get(`${BASE_URL}`);
    check(res, {
        'Status is 200':(r) => r.status === 200
    })
    sleep(1);
}