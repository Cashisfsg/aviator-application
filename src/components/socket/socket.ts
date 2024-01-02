import { io } from "socket.io-client";

const URL = "http://5.45.65.88:8080";
// const token = JSON.parse("");

export const socket = io(URL, {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGM2MjcyNGVjYmE1MmRhZmU1YWIwMCIsImlhdCI6MTcwNDAxNTY0MiwiZXhwIjoxNzA0NjIwNDQyfQ.jbUSMw_gV9FEMoLLt7C179SWlAtpUS0Ug61iH2p-12Y"
    }
});
