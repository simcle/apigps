import mqtt from 'mqtt'
import fs from 'fs'
import path from 'path'


const KEY = fs.readFileSync(path.join('AWS_KEY/private.pem.key'))
const CERT = fs.readFileSync(path.join('AWS_KEY/certificate.pem.crt'))
const TRUSTED_CA_LIST = fs.readFileSync(path.join('AWS_KEY/AmazonRootCA1.pem'))

const port = 8883;
const host = 'a3y9cc9doxfij-ats.iot.us-east-1.amazonaws.com'
const options = {
    prort: port,
    host: host,
    key: KEY,
    cert: CERT,
    rejectUnauthorized: true,
    ca: TRUSTED_CA_LIST,
    protocol: 'mqtts'
}


export const AwsMqtt = mqtt.connect(options)
AwsMqtt.subscribe('#'); 
AwsMqtt.subscribe('$aws/events/presence/connected/#')
AwsMqtt.subscribe('$aws/events/presence/disconnected/#')
let a = 0

AwsMqtt.on('connect', () => {
    console.log('IoT is Connected')
})

