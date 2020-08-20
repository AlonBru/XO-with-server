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
        className='buttonHOF'
        onClick={getHOF} 
        onClose={()=>{
            setDisplayHOF(false)
        }}>
            Display Hall Of Fame
        </button>
        <Modal  open={displayHOF} onClose={()=>{setDisplayHOF(false)}}>
        <>
        <h1>HAll of Fame</h1>
        <table className='recordsModal'>
            <thead>
                <tr>
                    <th>Winner's Name</th>
                    <th>Date of win</th>
                    <th>time to win</th>
                </tr>
            </thead>
            <tbody>
              {HOF.map(record=>{
                return(
                    <tr key={record.id}>        
                        <td>{record.winnerName}</td>
                        <td>{record.date}</td>
                        <td>{record.gameDuration}</td>
                    </tr>)})
            }  
            </tbody>
            
        </table>
        </>
        </Modal>
    </>
    )
}
export default HallOfFame