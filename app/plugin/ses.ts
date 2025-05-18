import { SESClient,SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
    region: process.env.AWS_REGION,
});

const sendEmailSes = async (to: string,otp:number) => {
    const command = new SendEmailCommand({
        Destination:{
            ToAddresses: [to],
        },
        Message:{
            Body:{
                Text:{
                    Data:`Sua chave de verificação é ${otp}`
                }
            },
            Subject:{
                Data:"Verificação de conta"
            }
        },

        Source: process.env.SES_EMAIL,
    
    })

     sesClient.send(command).then(()=>{
        console.log("Email enviado com sucesso")
     }).catch((error)=>{
        console.error("Erro ao enviar email",error)
        throw new Error("Erro ao enviar email")
     })

}

export default sendEmailSes;
