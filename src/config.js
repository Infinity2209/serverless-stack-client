const config = {
    s3: {
        REGION: "us-east-1",
        BUCKET: "ananta-notes",
    },
    apiGateway: {
        REGION: "us-east-1",
        URL: "https://sjms08fhj8.execute-api.us-east-1.amazonaws.com/prod",
    },
    cognito: {
        REGION: "us-east-1",
        USER_POOL_ID: "us-east-1_AuztL6EbL",
        APP_CLIENT_ID: "6ihpe0tcjgeqhmcmcs7ngosabg",
        IDENTITY_POOL_ID: "us-east-1:3aad0b24-d092-4958-892d-4e89f9e404e0",
    },
};

export default config;