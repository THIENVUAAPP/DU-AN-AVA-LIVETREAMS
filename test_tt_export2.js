import * as pkg from 'tiktok-live-connector';
console.log(Object.keys(pkg).filter(k => k.toLowerCase().includes('connection') || k.toLowerCase().includes('tiktoklive')));
