import React, { useState } from 'react';
import {Modal} from "@material-ui/core";
import './index.css';

function WinnerList({theWinners}){
    const [open1,setOpen]=useState(false)

    return(
        <div>
            {
                theWinners.map((v,i)=>
                <div key={i}>name:{v.winnerName} date:{v.date}</div>
                )
            }
        </div>
    )

}

export default WinnerList;