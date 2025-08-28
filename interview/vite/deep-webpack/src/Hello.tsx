import React from 'react';
import avatar from './images/avatar.webp';
import book from './images/book.webp';
import add from './math.js'
const Hello = () => {
    return (
        <div>
            <h1>老板是傻逼</h1>
            <img src={avatar} alt="人" />
            <img src={book} alt="书" />
            {add(1,2)}
        </div>
    )
}

export default Hello;