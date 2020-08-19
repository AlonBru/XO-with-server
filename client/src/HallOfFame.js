import React,{useState} from 'react';
import { Modal } from '@material-ui/core';
import Axios from 'axios';

const HallOfFame= () => {
    const [displayHOF,setDisplayHOF]= useState(false)
    const [HOF,setHOF]= useState([])
    const  getHOF= async () => {
        const records = (await Axios.get('/api/v1/records')).data;
        setDisplayHOF(true)
            if (records.length){
            console.log(records)
            setHOF(records);
            } else {
                setHOF([{winnerName:'None on record', date:'get to winning!'}])
            }
    }
    return(<>
        <button 
        onClick={getHOF} 
        onClose={()=>{
            setDisplayHOF(false)
        }}>
            Display Hall Of Fame
        </button>
        <Modal open={displayHOF} onClose={()=>{setDisplayHOF(false)}}>
       {/* <></> */}
        <table>
            <tr>
                <th>Winner's Name</th>
                <th>Date of win</th>
            </tr>
            {HOF.map(record=>{
                return(
                    <tr>        
                        <td>{record.winnerName}</td>
                        <td>{record.date}</td>
                    </tr>)})
            }
        </table>
        </Modal>
    </>
    )
}
export default HallOfFame