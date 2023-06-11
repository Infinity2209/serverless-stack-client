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
        USER_POOL_ID: "us-east-1_IW3pN3Ynt",
        APP_CLIENT_ID: "1h9a0ksglko05hrs132qd6rf74",
        IDENTITY_POOL_ID: "us-east-1:234e9339-902d-4d25-ba68-6a4bf111f461",
    },
};

export default config;