import React, { useState } from 'react';
import {Modal} from "@material-ui/core";
import './index.css';

function WinnerList({theWinners}){
    const [open1,setOpen]=useState(false)

    return(
        <div>
            {
                theWinners.map((v,i)=>
            <div key={i}><b>Name:</b>{v.winnerName} <b>Date:</b>{v.date} <b>Time of the game:</b>{v.gameTime} sec</div>
                )
            }
        </div>
    )

}

export default WinnerList;