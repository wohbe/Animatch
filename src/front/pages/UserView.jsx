import React from "react";
import NavBar from "../components/Navbar";
import UserInfo from "../components/UserInfo";

// Función para dividir las imágenes en grupos de 6
const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const Userview = () => {

    return (
        <div>
            <NavBar />
            <UserInfo />
        </div>
    );
};

export default Userview;